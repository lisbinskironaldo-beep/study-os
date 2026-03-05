/* =====================================================
   AMBIENT ENGINE
===================================================== */

const AmbientEngine = {

    /* ================= CATEGORIES ================= */

    categories: {

              favorites: {
    icon: "⭐",
    label: "Favoritos",
    sounds: []
},

        rain: {
            icon: "🌧",
            label: "Chuva",
            sounds: [
                { name: "Stormfall", src: "assets/sounds/Stormfall.wav" },
                { name: "Rainveil", src: "assets/sounds/Rainveil.mp3" },
                { name: "Downpour", src: "assets/sounds/Downpour.wav" },
                { name: "Mistfall", src: "assets/sounds/Mistfall.mp3" },
                { name: "Cloudburst", src: "assets/sounds/Cloudburst.wav" },
                { name: "Stormhush", src: "assets/sounds/Stormhush.wav" },
                { name: "Greyflow", src: "assets/sounds/Greyflow.wav" },
                { name: "Nightrain", src: "assets/sounds/Nightrain.mp3" },
                { name: "Stillstorm", src: "assets/sounds/Stillstorm.mp3" }
            ]
        },

        cafe: {
            icon: "☕",
            label: "Café",
            sounds: [
                { name: "Café suave", src: "assets/sounds/cafe.mp3" }
            ]
        },

        library: {
            icon: "📚",
            label: "Biblioteca",
            sounds: [
                { name: "Biblioteca silenciosa", src: "assets/sounds/white.mp3" }
            ]
        },

        nature: {
            icon: "🌿",
            label: "Natureza",
            sounds: [
                { name: "Forest Wind", src: "assets/sounds/forest.mp3" },
                { name: "Night Crickets", src: "assets/sounds/crickets.mp3" },
                { name: "River Flow", src: "assets/sounds/river.mp3" }
            ]
        },

        fireplace: {
            icon: "🔥",
            label: "Lareira",
            sounds: [
                { name: "Fireplace Calm", src: "assets/sounds/fireplace.mp3" },
                { name: "Warm Fire", src: "assets/sounds/fire2.mp3" }
            ]
        },

        city: {
            icon: "🌆",
            label: "Cidade",
            sounds: [
                { name: "Night City", src: "assets/sounds/city.mp3" },
                { name: "Distant Traffic", src: "assets/sounds/traffic.mp3" },
                { name: "Metro Ambience", src: "assets/sounds/metro.mp3" }
            ]
        },

        youtube: {
            icon: "▶",
            label: "YouTube",
            sounds: []
        }

    },

    currentAudio: null,
    currentCategory: null,
    currentIndex: 0,
    currentCategoryIndex: 0,

    /* ================= INIT ================= */

    init() {

        this.bindOutsideClick();

        this.renderPlayerCategories();
        this.bindPlayer();
        this.bindKeyboard();

        const p = document.getElementById("ambientPrev");
        const n = document.getElementById("ambientNext");
        const t = document.getElementById("ambientPlay");

        const volume = document.getElementById("ambientVolume");

if (volume) {
    volume.addEventListener("input", (e) => {
        if (this.currentAudio) {
            this.currentAudio.volume = parseFloat(e.target.value);
        }
    });
}

        if (p) p.addEventListener("click", () => this.prev());
        if (n) n.addEventListener("click", () => this.next());
        if (t) t.addEventListener("click", () => this.toggle());

    },

        /* ================= PLAYER UI ================= */

    updatePlayerUI(name, category) {

    const track = document.getElementById("ambientTrack");
    const icon = document.getElementById("ambientIcon");

    if (track) track.textContent = name;

    if (icon && this.currentCategory) {
        icon.textContent = this.categories[this.currentCategory].icon;
    }

},

    /* ================= PANEL ================= */

    openPanel(categoryKey) {

        this.currentCategory = categoryKey;
        this.currentIndex = 0;

        const panel = document.getElementById("ambientPanelNew");
        const category = this.categories[categoryKey];

        if (!panel) return;

        panel.innerHTML = `
            <div class="ambient-panel-title">${category.label}</div>
            ${category.sounds.map((sound, index) => `
                <div class="ambient-option" data-index="${index}">
                    ${sound.name}
                </div>
            `).join("")}
        `;

        panel.classList.add("show");

        panel.querySelectorAll(".ambient-option").forEach(opt => {

            opt.addEventListener("click", () => {

                const index = parseInt(opt.dataset.index);

                this.currentIndex = index;

                this.play(
                    this.categories[this.currentCategory]
                        .sounds[this.currentIndex].src
                );

            });

        });

    },

    /* ================= PLAY ================= */

    play(src) {

        if (this.currentAudio) {
            this.fadeOut(this.currentAudio);
        }

        const sound = this.categories[this.currentCategory].sounds[this.currentIndex];

        this.updatePlayerUI(
            sound.name,
            this.categories[this.currentCategory].label
        );

        const audio = new Audio(src);

        audio.loop = true;
       const volumeSlider = document.getElementById("ambientVolume");
audio.volume = volumeSlider ? parseFloat(volumeSlider.value) : 0.3;

        audio.play();

        this.fadeIn(audio);

        this.currentAudio = audio;

    },

    prev() {

        if (!this.currentCategory) return;

        const sounds = this.categories[this.currentCategory].sounds;

        this.currentIndex =
            (this.currentIndex - 1 + sounds.length) % sounds.length;

        this.play(sounds[this.currentIndex].src);

    },

    next() {

        if (!this.currentCategory) return;

        const sounds = this.categories[this.currentCategory].sounds;

        this.currentIndex =
            (this.currentIndex + 1) % sounds.length;

        this.play(sounds[this.currentIndex].src);

    },

    toggle() {

        if (!this.currentAudio) return;

        if (this.currentAudio.paused)
            this.currentAudio.play();
        else
            this.currentAudio.pause();

    },

    /* ================= FADE ================= */

    fadeIn(audio) {

        let volume = 0;

        const interval = setInterval(() => {

            volume += 0.05;

            if (volume >= 0.3) {
                volume = 0.3;
                clearInterval(interval);
            }

            audio.volume = volume;

        }, 50);

    },

    fadeOut(audio) {

        let volume = audio.volume;

        const interval = setInterval(() => {

            volume -= 0.05;

            if (volume <= 0) {

                volume = 0;

                clearInterval(interval);

                audio.pause();

            }

            audio.volume = volume;

        }, 50);

    },

    /* ================= PLAYER ================= */

    renderPlayerCategories(){

const container = document.getElementById("ambientCategories")
if(!container) return

const keys = Object.keys(this.categories)
const total = keys.length

container.innerHTML = keys.map((key,i)=>{

let pos = i - this.currentCategoryIndex

if(pos > Math.floor(total/2)) pos -= total
if(pos < -Math.floor(total/2)) pos += total

let cls = "ambient-category"

if(pos === 0) cls += " center"
else if(Math.abs(pos) === 1) cls += " side"

return `
<div class="${cls}"
data-index="${i}"
style="
position:absolute;
left:50%;
transform:translateX(calc(-50% + ${pos*160}px));
transition:transform .35s;
">
<img src="assets/ambient/${key}.jpg">
</div>
`

}).join("")

container.querySelectorAll(".ambient-category").forEach(btn=>{

btn.addEventListener("click",(e)=>{

e.stopPropagation()

const index = parseInt(btn.dataset.index)

this.currentCategoryIndex = index
this.renderPlayerCategories()

const category = keys[index]

this.currentCategory = category
this.currentIndex = 0

this.renderPlayerSounds(category)

document
.getElementById("ambientPanelNew")
.classList.add("open")

})

})

},

    renderPlayerSounds(category) {

        const container = document.getElementById("ambientSounds");

        if (!container) return;

        if (category === "youtube") {

            container.innerHTML = `
            <div class="youtube-search">
                <input id="ytSearchInput" placeholder="Buscar no YouTube">
                <button id="ytSearchBtn">Buscar</button>
            </div>

            <div id="ytResults"></div>
            `;

            document
                .getElementById("ytSearchBtn")
                .onclick = searchYouTube;

            return;

        }

        const sounds = this.categories[category].sounds;

            container.innerHTML = sounds.map((s, i) => `
            <div class="ambient-sound" data-cat="${category}" data-index="${i}">

            <span class="ambient-preview" data-index="${i}">▶</span>

            <span class="ambient-title">${s.name}</span>

            <span class="ambient-fav" data-index="${i}">
${category === "favorites" ? "✖" : "☆"}
</span>

            </div>
                `).join("");

        container.querySelectorAll(".ambient-sound").forEach(row => {

        row.addEventListener("click", (e) => {

        if(e.target.classList.contains("ambient-preview")) return;
        if(e.target.classList.contains("ambient-fav")) return;

        container.querySelectorAll(".ambient-sound")
        .forEach(el => el.classList.remove("active"));

        row.classList.add("active");

        this.currentCategory = row.dataset.cat;
        this.currentIndex = parseInt(row.dataset.index);

        this.play(
            this.categories[this.currentCategory]
                .sounds[this.currentIndex].src
        );


    });

});

container.querySelectorAll(".ambient-preview").forEach(btn => {

    btn.addEventListener("click", (e) => {

        e.stopPropagation();

        document.querySelectorAll(".ambient-preview")
        .forEach(p => p.classList.remove("preview-active"));

        btn.classList.add("preview-active");

        const index = parseInt(btn.dataset.index);

        const sound = this.categories[category].sounds[index];

        const preview = new Audio(sound.src);

        preview.volume = 0.35;

        preview.play();

        setTimeout(() => {
            preview.pause();
        }, 4000);

    });

});

container.querySelectorAll(".ambient-fav").forEach(btn => {

    btn.addEventListener("click", (e) => {

        e.stopPropagation();

        const row = btn.closest(".ambient-sound");

        const cat = row.dataset.cat;
        const index = parseInt(row.dataset.index);

        const sound = this.categories[cat].sounds[index];

        if(cat === "favorites"){

            this.categories.favorites.sounds =
            this.categories.favorites.sounds.filter(s => s.name !== sound.name);

            row.remove();

            return;

        }

        btn.classList.toggle("fav-active");

        if(btn.classList.contains("fav-active")){

            this.categories.favorites.sounds.push(sound);

        }else{

            this.categories.favorites.sounds =
            this.categories.favorites.sounds.filter(s => s.name !== sound.name);

        }

    });

});

    },

    bindKeyboard(){

document.addEventListener("keydown",(e)=>{

const panel = document.getElementById("ambientPanelNew")
if(!panel || !panel.classList.contains("open")) return

if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"].includes(e.key)){
e.preventDefault()
}

const keys = Object.keys(this.categories)
const rows = document.querySelectorAll(".ambient-sound")
const active = document.querySelector(".ambient-sound.active")

/* ===== CATEGORIAS ===== */

if(!active){

if(e.key === "ArrowRight"){

this.currentCategoryIndex =
(this.currentCategoryIndex + 1) % keys.length

this.currentCategory = keys[this.currentCategoryIndex]
this.currentIndex = 0

this.renderPlayerCategories()
this.renderPlayerSounds(this.currentCategory)

return
}

if(e.key === "ArrowLeft"){

this.currentCategoryIndex =
(this.currentCategoryIndex - 1 + keys.length) % keys.length

this.currentCategory = keys[this.currentCategoryIndex]
this.currentIndex = 0

this.renderPlayerCategories()
this.renderPlayerSounds(this.currentCategory)

return
}

if(e.key === "ArrowDown"){

if(rows.length){
rows[0].classList.add("active")
}

return
}

}

/* ===== NAVEGAÇÃO NAS MUSICAS ===== */

if(active){

let index = [...rows].indexOf(active)

/* ↓ desce */

if(e.key === "ArrowDown"){

index++
if(index >= rows.length) index = rows.length-1

rows.forEach(r=>r.classList.remove("active"))
rows[index].classList.add("active")

return
}

/* ↑ sobe */

if(e.key === "ArrowUp"){

index--

if(index < 0){
active.classList.remove("active")
return
}

rows.forEach(r=>r.classList.remove("active"))
rows[index].classList.add("active")

return
}

/* → selecionar favorito */

if(e.key === "ArrowRight"){

active.classList.remove("preview-focus")
active.classList.add("fav-focus")

return
}

/* ← selecionar preview */

if(e.key === "ArrowLeft"){

active.classList.remove("fav-focus")
active.classList.add("preview-focus")

return
}

/* ENTER executa */

if(e.key === "Enter"){

/* preview */

if(active.classList.contains("preview-focus")){

const preview = active.querySelector(".ambient-preview")
if(preview) preview.click()
return
}

/* favorito */

if(active.classList.contains("fav-focus")){

const fav = active.querySelector(".ambient-fav")
if(fav) fav.click()
return
}

/* tocar / pausar */

const cat = active.dataset.cat
const index = parseInt(active.dataset.index)

if(
this.currentAudio &&
this.currentCategory === cat &&
this.currentIndex === index
){

this.toggle()
return

}

this.currentCategory = cat
this.currentIndex = index

this.play(
this.categories[cat].sounds[index].src
)

return
}

}

})

},

    bindPlayer() {

        const main = document.getElementById("ambientMain");
        const panel = document.getElementById("ambientPanelNew");

        if (!main || !panel) return;

        main.addEventListener("click", () => {

            panel.classList.toggle("open");

        });

    },

    bindOutsideClick() {

        document.addEventListener("click", (e) => {

            const player = document.getElementById("ambientPlayer");
            const panel = document.getElementById("ambientPanelNew");

            if (
    player &&
    panel &&
    !player.contains(e.target) &&
    !panel.contains(e.target)
) {
    panel.classList.remove("open");
}

        });

    }

};

/* =====================================================
   YOUTUBE
===================================================== */

async function searchYouTube() {

    const query = document.getElementById("ytSearchInput").value;

    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search
        ?part=snippet
        &type=video
        &maxResults=10
        &q=${encodeURIComponent(query)}
        &key=API_KEY`
    );

    const data = await res.json();

    const results = document.getElementById("ytResults");

    results.innerHTML = data.items.map(v => `

    <div class="youtube-item"
    onclick="playYouTube('${v.id.videoId}')">

        <img src="${v.snippet.thumbnails.medium.url}">
        <div>${v.snippet.title}</div>

    </div>

    `).join("");

}

let ytPlayer;

function onYouTubeIframeAPIReady(){

    ytPlayer = new YT.Player('youtubePlayer',{
        height:'0',
        width:'0',
        videoId:'',
        playerVars:{
            autoplay:1,
            controls:0,
            modestbranding:1,
            rel:0
        }
    });

}

function playYouTube(id){

    if(!ytPlayer) return;

    if(AmbientEngine.currentAudio){
        AmbientEngine.fadeOut(AmbientEngine.currentAudio);
    }

    ytPlayer.loadVideoById(id);

}

/* =====================================================
   INIT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    AmbientEngine.init();

});

const Ambient = AmbientEngine;