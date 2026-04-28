const AmbientUI = {

setHiddenState(element, hidden) {

if (!element) return

element.setAttribute("aria-hidden", hidden ? "true" : "false")
element.inert = Boolean(hidden)

},

icon(name) {

const icons = {
library: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 5.25h2.4a1.1 1.1 0 0 1 1.1 1.1v11.4a1.1 1.1 0 0 1-1.1 1.1H6.5a1.1 1.1 0 0 1-1.1-1.1V6.35a1.1 1.1 0 0 1 1.1-1.1Z"/><path d="M11.1 4.5h2.5a1.1 1.1 0 0 1 1.1 1.1v12.9a1.1 1.1 0 0 1-1.1 1.1h-2.5a1.1 1.1 0 0 1-1.1-1.1V5.6a1.1 1.1 0 0 1 1.1-1.1Z"/><path d="M15.8 7h1.8a1 1 0 0 1 1 1v9.7a1 1 0 0 1-1 1h-1.8"/></svg>`,
help: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.75"/><path d="M9.7 9.45a2.52 2.52 0 0 1 4.8 1.02c0 1.8-2.35 2.16-2.35 3.95"/><circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none"/></svg>`,
star: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 4.9 2.2 4.45 4.92.71-3.56 3.48.84 4.9L12 16.08l-4.4 2.36.84-4.9L4.88 10.06l4.92-.71Z"/></svg>`,
starFilled: `<svg class="ambient-icon ambient-icon--filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 4.9 2.2 4.45 4.92.71-3.56 3.48.84 4.9L12 16.08l-4.4 2.36.84-4.9L4.88 10.06l4.92-.71Z"/></svg>`,
categories: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.75 8.25V5.8a1.05 1.05 0 0 1 1.05-1.05h2.45"/><path d="M15.75 4.75h2.45a1.05 1.05 0 0 1 1.05 1.05v2.45"/><path d="M19.25 15.75v2.45a1.05 1.05 0 0 1-1.05 1.05h-2.45"/><path d="M8.25 19.25H5.8a1.05 1.05 0 0 1-1.05-1.05v-2.45"/><path d="M8 8h3.2v3.2H8z"/><path d="M12.8 8H16v3.2h-3.2z"/><path d="M8 12.8h3.2V16H8z"/><path d="M12.8 12.8H16V16h-3.2z"/></svg>`,
shuffle: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 6H19v2.5"/><path d="M5 7.5h3.7c1.1 0 2.14.5 2.83 1.36l4.94 6.28c.69.87 1.73 1.36 2.84 1.36H19"/><path d="M16.5 18H19v-2.5"/><path d="M5 16.5h3.7c1.1 0 2.14-.5 2.83-1.36l1.12-1.43"/><path d="m16.3 7.7 2.7-2.7"/></svg>`,
close: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 6.5 17.5 17.5"/><path d="M17.5 6.5 6.5 17.5"/></svg>`,
play: `<svg class="ambient-icon ambient-icon--filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 7.4a.8.8 0 0 1 1.22-.68l7.1 4.6a.8.8 0 0 1 0 1.34l-7.1 4.6A.8.8 0 0 1 9 16.52z"/></svg>`,
pause: `<svg class="ambient-icon ambient-icon--filled" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7.25" y="6.8" width="3.7" height="10.4" rx="1.2"/><rect x="13.05" y="6.8" width="3.7" height="10.4" rx="1.2"/></svg>`,
prev: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 6.8v10.4"/><path d="m17 7.3-6.2 4.7L17 16.7V7.3Z" fill="currentColor" stroke="none"/></svg>`,
next: `<svg class="ambient-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 6.8v10.4"/><path d="m7 7.3 6.2 4.7L7 16.7V7.3Z" fill="currentColor" stroke="none"/></svg>`
}

return icons[name] || ""

},

init() {

const root = document.getElementById("ambientRoot")
if (!root) return

root.style.display = "block"

root.innerHTML = `
<button id="ambientPeek" class="ambient-peek" type="button" title="Mostrar player" aria-label="Mostrar player de som">
  <span class="ambient-peek-dot"></span>
  <span class="ambient-peek-label">Som</span>
</button>

<div id="ambientMini" class="ambient-mini" title="Abrir player">
  <div class="ambient-mini-main">
    <button id="ambientLibraryToggle" class="ambient-mini-icon" type="button" title="Abrir biblioteca" aria-label="Abrir biblioteca">
      ${this.icon("library")}
    </button>

    <div class="ambient-now">
      <div id="ambientTicker" class="ambient-ticker" aria-live="polite">
        <div class="ambient-ticker-track">
          <span id="ambientTickerPrimary" class="ambient-ticker-copy">SOM AMBIENTE / Escolha uma trilha para acompanhar o estudo</span>
          <span id="ambientTickerClone" class="ambient-ticker-copy" aria-hidden="true"></span>
        </div>
      </div>
    </div>

    <div class="ambient-mini-actions">
      <button id="ambientPrev" class="ambient-secondary-control" type="button" title="Faixa anterior" aria-label="Faixa anterior">${this.icon("prev")}</button>
      <button id="ambientNext" class="ambient-secondary-control" type="button" title="Próxima faixa" aria-label="Próxima faixa">${this.icon("next")}</button>
      <button id="ambientPlay" class="ambient-primary-control" type="button" title="Reproduzir" aria-label="Reproduzir">${this.icon("play")}</button>
      <button id="ambientHideMini" class="ambient-secondary-control" type="button" title="Ocultar player" aria-label="Ocultar player">${this.icon("close")}</button>
    </div>
  </div>

  <div class="ambient-mini-meta">
    <div class="ambient-progress">
      <span id="ambientTimeCurrent">0:00</span>
      <input id="ambientSeek" type="range" min="0" max="100" value="0" step="0.1">
      <span id="ambientTimeTotal">0:00</span>
    </div>

    <div class="ambient-volume-wrap">
      <span class="ambient-volume-label">Vol</span>
      <input id="ambientVolume" type="range" min="0" max="1" step="0.01" value="${AmbientState.volume}">
    </div>
  </div>
</div>

<div id="ambientPanel" class="ambient-panel">
  <div class="ambient-header">
    <div class="ambient-header-copy">
      <div class="ambient-panel-kicker">Som ambiente</div>
      <div class="ambient-panel-title">Biblioteca de foco</div>
    </div>

    <div class="ambient-header-actions">
      <button id="ambientHelpBtn" type="button" title="Atalhos" aria-label="Atalhos">${this.icon("help")}</button>
      <button id="ambientFavBtn" type="button" title="Mostrar favoritos" aria-label="Mostrar favoritos">${this.icon("star")}</button>
      <button id="ambientCatBtn" type="button" title="Categorias" aria-label="Categorias">${this.icon("categories")}</button>
      <button id="ambientShuffle" type="button" title="Embaralhar" aria-label="Embaralhar">${this.icon("shuffle")}</button>
      <button id="ambientPanelHide" type="button" title="Fechar biblioteca" aria-label="Fechar biblioteca">${this.icon("close")}</button>
    </div>
  </div>

  <div id="categorySelector" class="category-selector hidden">
    <button class="cat-item" data-cat="lofi" type="button">Lofi</button>
    <button class="cat-item" data-cat="focus" type="button">Focus</button>
    <button class="cat-item" data-cat="piano" type="button">Piano</button>
    <button class="cat-item" data-cat="jazz" type="button">Jazz</button>
    <button class="cat-item" data-cat="ambient" type="button">Ambient</button>
    <button class="cat-item" data-cat="nature" type="button">Nature</button>
    <button class="cat-item" data-cat="fireplace" type="button">Fire</button>
    <button class="cat-item" data-cat="rain" type="button">Rain</button>
    <button class="cat-item" data-cat="white" type="button">Noise</button>
  </div>

  <div id="ambientList" class="ambient-list"></div>
</div>
`

AmbientState.panelMode = 2

this.bindControls()
this.restoreMiniPosition()
this.setPanelMode(AmbientState.panelMode)
this.updateShell()
this.constrainFloatingUI()

},

getCatalogItemById(id) {

if (!id) return null

for (const list of Object.values(AmbientState.catalog || {})) {
const found = Array.isArray(list)
? list.find(item => item.id === id)
: null

if (found) return found
}

return null

},

getDisplayItem() {

const currentItem = AmbientState.visible.find(
item => item.id === AmbientState.currentVideo
)

if (currentItem) return currentItem

return this.getCatalogItemById(AmbientState.currentVideo)
|| AmbientState.visible[AmbientState.cursor]
|| AmbientState.visible[0]
|| null

},

updateShell() {

const item = this.getDisplayItem()
const playButton = document.getElementById("ambientPlay")
const mini = document.getElementById("ambientMini")
const peek = document.getElementById("ambientPeek")
const tickerPrimary = document.getElementById("ambientTickerPrimary")
const tickerClone = document.getElementById("ambientTickerClone")
const label = item?.category ? item.category.toUpperCase() : "SOM AMBIENTE"
const title = item?.title || "Escolha uma trilha para acompanhar o estudo"
const tickerText = `${label} / ${title}`

if (playButton) {
const isPlaying = AmbientState.playing
playButton.innerHTML = this.icon(isPlaying ? "pause" : "play")
playButton.title = isPlaying ? "Pausar" : "Reproduzir"
playButton.setAttribute("aria-label", isPlaying ? "Pausar" : "Reproduzir")
playButton.dataset.state = isPlaying ? "pause" : "play"
}

if (tickerPrimary) {
tickerPrimary.textContent = tickerText
}

if (tickerClone) {
tickerClone.textContent = tickerText
}

if (mini) {
mini.classList.toggle("is-playing", AmbientState.playing)
}

const libraryToggle = document.getElementById("ambientLibraryToggle")
if (libraryToggle) {
libraryToggle.classList.toggle("is-active", AmbientState.panelMode === 0)
}

const favoriteButton = document.getElementById("ambientFavBtn")
if (favoriteButton) {
favoriteButton.classList.toggle("is-active", AmbientState.favoritesMode)
favoriteButton.title = AmbientState.favoritesMode
? "Voltar para a lista aleatória"
: "Mostrar favoritos"
favoriteButton.setAttribute(
"aria-label",
AmbientState.favoritesMode
? "Voltar para a lista aleatória"
: "Mostrar favoritos"
)
}

const categoryButton = document.getElementById("ambientCatBtn")
if (categoryButton) {
categoryButton.classList.toggle("is-active", AmbientState.ui.categoryMenuOpen)
}

if (peek) {
peek.classList.toggle("is-playing", AmbientState.playing)
peek.classList.toggle("is-visible", AmbientState.panelMode === 2)
}

this.syncTicker()
this.updatePanelTheme()

},

syncTicker() {

const ticker = document.getElementById("ambientTicker")
const primary = document.getElementById("ambientTickerPrimary")
if (!ticker || !primary) return

requestAnimationFrame(() => {
const shouldScroll = primary.scrollWidth > ticker.clientWidth + 12
ticker.classList.toggle("is-scrolling", shouldScroll)
})

},

updatePanelTheme() {

const panel = document.getElementById("ambientPanel")
const item = this.getDisplayItem()

if (!panel) return

panel.dataset.category = item?.category || "default"

},

syncAccessibility() {

const mini = document.getElementById("ambientMini")
const panel = document.getElementById("ambientPanel")
const peek = document.getElementById("ambientPeek")
const panelOpen = AmbientState.panelMode === 0
const miniHidden = AmbientState.panelMode === 2

this.setHiddenState(panel, !panelOpen)
this.setHiddenState(mini, miniHidden)
this.setHiddenState(peek, AmbientState.panelMode !== 2)

},

setPanelMode(mode) {

const mini = document.getElementById("ambientMini")
const panel = document.getElementById("ambientPanel")

AmbientState.panelMode = mode
AmbientState.ui.panelOpen = mode === 0

if (
document.body?.dataset?.mode === "questions" &&
mode !== 2 &&
AmbientState.ui.suppressedByQuestions
) {
AmbientState.ui.suppressedByQuestions = false
}

if (mini) {
mini.classList.toggle("is-hidden", mode === 2)
}

if (panel) {
panel.classList.toggle("is-open", mode === 0)
}

if (mode !== 0) {
this.closeCategorySelector()
}

this.updateShell()
this.syncAccessibility()

if (mode !== 2) {
requestAnimationFrame(() => {
this.constrainFloatingUI()
})
}

},

togglePanel(forceOpen) {

const shouldOpen =
typeof forceOpen === "boolean"
? forceOpen
: AmbientState.panelMode !== 0

this.setPanelMode(shouldOpen ? 0 : 1)

},
closeCategorySelector() {

const selector = document.getElementById("categorySelector")
if (!selector) return

selector.classList.add("hidden")
AmbientState.ui.categoryMenuOpen = false
this.updateShell()

},

toggleCategorySelector() {

const selector = document.getElementById("categorySelector")
if (!selector) return

selector.classList.toggle("hidden")
AmbientState.ui.categoryMenuOpen =
!selector.classList.contains("hidden")
this.updateShell()

},

renderList() {

const list = document.getElementById("ambientList")
if (!list) return

if (!AmbientState.visible.length) {
list.innerHTML = `
<div class="ambient-empty">
  Nenhuma trilha encontrada ainda.
</div>
`
this.updateShell()
return
}

list.innerHTML = AmbientState.visible.map((item, index) => {

const favorite = AmbientState.favorites.includes(item.id)
const isPlaying = item.id === AmbientState.currentVideo
const isCursor = index === AmbientState.cursor

return `
<div class="ambient-item${isPlaying ? " playing" : ""}${isCursor ? " cursor" : ""}" data-index="${index}" data-id="${item.id}">
  <button class="fav-btn${favorite ? " active" : ""}" data-id="${item.id}" type="button" title="${favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}" aria-label="${favorite ? "Remover dos favoritos" : "Salvar nos favoritos"}">${this.icon(favorite ? "starFilled" : "star")}</button>
  <img src="https://i.ytimg.com/vi/${item.id}/mqdefault.jpg" alt="${item.title}">
  <div class="ambient-item-copy">
    <div class="ambient-item-meta">${item.category || "mix"}</div>
    <div class="ambient-title">${item.title}</div>
  </div>
</div>
`

}).join("")

this.bindItems()
this.updateShell()

const rows = list.querySelectorAll(".ambient-item")
const activeRow = rows[AmbientState.cursor]

if (activeRow) {
activeRow.scrollIntoView({
block: "nearest",
behavior: "smooth"
})
}

},

bindItems() {

document.querySelectorAll("#ambientList .ambient-item")
.forEach((row, index) => {

const item = AmbientState.visible[index]
if (!item) return

row.querySelector(".fav-btn")?.addEventListener("click", (event) => {
event.stopPropagation()
this.toggleFavorite(item.id)
})

row.addEventListener("click", () => {

AmbientState.cursor = index

if (item.id === AmbientState.currentVideo && AmbientState.player) {
AmbientPlayer.toggle()
this.renderList()
return
}

AmbientPlayer.playIndex(index)
this.renderList()

})

})

},

toggleFavorite(id) {

const index = AmbientState.favorites.indexOf(id)

if (index === -1) {
AmbientState.favorites.push(id)
} else {
AmbientState.favorites.splice(index, 1)
}

localStorage.setItem(
"ambient_favorites",
JSON.stringify(AmbientState.favorites)
)

if (AmbientState.favoritesMode) {
AmbientYoutube.buildFavoritesList()
return
}

this.renderList()

},

closeHelp() {

const help = document.getElementById("ambientHelp")
if (!help) return false

help.remove()
AmbientState.ui.helpOpen = false
return true

},

closeBlockedTracks() {

const blocked = document.getElementById("ambientBlocked")
if (!blocked) return false

blocked.remove()
AmbientState.ui.blockedOpen = false
return true

},

toggleHelp() {

if (this.closeHelp()) {
return
}

this.closeBlockedTracks()

let help = document.createElement("div")
help.id = "ambientHelp"
help.innerHTML = `
<div class="ambient-help-box">
  <button id="ambientHelpClose" type="button" aria-label="Fechar ajuda" title="Fechar ajuda">${this.icon("close")}</button>
  <h3>Atalhos do player</h3>
  <div>Alt + M: alterna painel, mini e oculto</div>
  <div>Alt + F: abre favoritos</div>
  <div>Alt + S: embaralha a lista</div>
  <div>Alt + T: lista faixas bloqueadas</div>
  <div>Alt + Enter: favorita a trilha atual</div>
  <div>Setas: navega e troca faixas</div>
  <div>Space: play ou pause</div>
  <div>Esc: fecha o painel</div>
</div>
`

document.body.appendChild(help)
AmbientState.ui.helpOpen = true

document.getElementById("ambientHelpClose")?.addEventListener("click", () => {
this.closeHelp()
})

help.addEventListener("click", (event) => {
if (event.target === help) {
this.closeHelp()
}
})

},

toggleBlockedTracks() {

if (this.closeBlockedTracks()) {
return
}

this.closeHelp()

const tracks = AmbientYoutube.getBlockedTracks()
const items = tracks.length
? tracks.map(track => `
  <div class="ambient-blocked-item">
    <div class="ambient-blocked-meta">${track.category.toUpperCase()}</div>
    <div class="ambient-blocked-title">${track.title}</div>
    <div class="ambient-blocked-id">${track.id}</div>
  </div>
`).join("")
: `
  <div class="ambient-blocked-empty">
    Nenhuma faixa bloqueada ainda.
  </div>
`

const blocked = document.createElement("div")
blocked.id = "ambientBlocked"
blocked.innerHTML = `
<div class="ambient-blocked-box">
  <button id="ambientBlockedClose" type="button" aria-label="Fechar lista" title="Fechar lista">${this.icon("close")}</button>
  <div class="ambient-blocked-header">
    <div class="ambient-blocked-kicker">Alt + T</div>
    <h3>Faixas indisponiveis</h3>
    <p>Essas trilhas falharam no embed e sairam do aleatorio. Troque os IDs no catalogo quando quiser revisar.</p>
  </div>
  <div class="ambient-blocked-list">${items}</div>
</div>
`

document.body.appendChild(blocked)
AmbientState.ui.blockedOpen = true

document.getElementById("ambientBlockedClose")?.addEventListener("click", () => {
this.closeBlockedTracks()
})

blocked.addEventListener("click", (event) => {
if (event.target === blocked) {
this.closeBlockedTracks()
}
})

},

restoreMiniPosition() {

const mini = document.getElementById("ambientMini")
if (!mini) return

const savedX = localStorage.getItem("ambientMiniX")
const savedY = localStorage.getItem("ambientMiniY")

if (!savedX || !savedY) return

mini.style.left = savedX
mini.style.top = savedY
mini.style.bottom = "auto"

},

positionPanelNearMini() {

const mini = document.getElementById("ambientMini")
const panel = document.getElementById("ambientPanel")

if (!mini || !panel || AmbientState.panelMode !== 0) return

const miniRect = mini.getBoundingClientRect()
const panelWidth = panel.offsetWidth
const gap = 12
const margin = 8
const compactViewport = window.innerWidth <= 760
const preferredHeight = Math.min(
compactViewport ? 520 : 560,
window.innerHeight - (margin * 2)
)
const availableAbove = Math.max(0, miniRect.top - gap - margin)
const availableBelow = Math.max(
0,
window.innerHeight - miniRect.bottom - gap - margin
)

let placeAbove = availableAbove >= availableBelow
let availableSpace = placeAbove ? availableAbove : availableBelow

if (availableSpace < 180) {
const otherSpace = placeAbove ? availableBelow : availableAbove
if (otherSpace > availableSpace) {
placeAbove = !placeAbove
availableSpace = otherSpace
}
}

const panelHeight = Math.max(
0,
 Math.min(preferredHeight, availableSpace)
)

panel.style.height = `${panelHeight}px`

let left = miniRect.left
left = Math.max(margin, Math.min(window.innerWidth - panelWidth - margin, left))

let top = placeAbove
? miniRect.top - panelHeight - gap
: miniRect.bottom + gap

panel.style.left = `${left}px`
panel.style.top = `${Math.max(margin, Math.min(window.innerHeight - panelHeight - margin, top))}px`
panel.style.bottom = "auto"

},

constrainFloatingUI() {

const mini = document.getElementById("ambientMini")
if (!mini) return

if (mini.style.left && mini.style.top) {
const width = mini.offsetWidth
const height = mini.offsetHeight
const x = Math.max(
8,
Math.min(window.innerWidth - width - 8, parseFloat(mini.style.left) || 0)
)
const y = Math.max(
8,
Math.min(window.innerHeight - height - 8, parseFloat(mini.style.top) || 0)
)

mini.style.left = `${x}px`
mini.style.top = `${y}px`
mini.style.bottom = "auto"
}

this.positionPanelNearMini()

},

bindControls() {

const mini = document.getElementById("ambientMini")
const panel = document.getElementById("ambientPanel")
const peek = document.getElementById("ambientPeek")
const libraryToggle = document.getElementById("ambientLibraryToggle")
const hideMiniButton = document.getElementById("ambientHideMini")
const helpButton = document.getElementById("ambientHelpBtn")
const favoriteButton = document.getElementById("ambientFavBtn")
const categoryButton = document.getElementById("ambientCatBtn")
const shuffleButton = document.getElementById("ambientShuffle")
const hideButton = document.getElementById("ambientPanelHide")
const playButton = document.getElementById("ambientPlay")
const nextButton = document.getElementById("ambientNext")
const prevButton = document.getElementById("ambientPrev")
const volume = document.getElementById("ambientVolume")
const seek = document.getElementById("ambientSeek")

if (libraryToggle) {
libraryToggle.addEventListener("click", (event) => {
event.stopPropagation()
this.togglePanel()
})
}

if (peek) {
peek.addEventListener("click", () => {
if (document.body.classList.contains("clock-immersion-mode")) {
AmbientPlayer.toggle()
return
}

this.setPanelMode(1)
})
}

if (helpButton) {
helpButton.addEventListener("click", (event) => {
event.stopPropagation()
this.toggleHelp()
})
}

if (favoriteButton) {
favoriteButton.addEventListener("click", () => {
if (AmbientState.favoritesMode) {
AmbientYoutube.buildRandomList()
return
}

AmbientYoutube.buildFavoritesList()
})
}

if (categoryButton) {
categoryButton.addEventListener("click", (event) => {
event.stopPropagation()
this.toggleCategorySelector()
})
}

if (shuffleButton) {
shuffleButton.addEventListener("click", () => {
AmbientYoutube.buildRandomList()
})
}

if (hideButton) {
hideButton.addEventListener("click", () => {
this.setPanelMode(1)
})
}

if (hideMiniButton) {
hideMiniButton.addEventListener("click", (event) => {
event.stopPropagation()
this.setPanelMode(2)
})
}

if (playButton) {
playButton.addEventListener("click", (event) => {
event.stopPropagation()
AmbientPlayer.toggle()
})
}

if (nextButton) {
nextButton.addEventListener("click", (event) => {
event.stopPropagation()
AmbientPlayer.next()
})
}

if (prevButton) {
prevButton.addEventListener("click", (event) => {
event.stopPropagation()
AmbientPlayer.prev()
})
}

if (volume) {
volume.addEventListener("input", () => {
AmbientState.volume = Number(volume.value)
localStorage.setItem("ambient_volume", AmbientState.volume)

if (AmbientState.player) {
AmbientState.player.setVolume(AmbientState.volume * 100)
}
})
}

if (seek) {
seek.addEventListener("input", () => {
if (!AmbientState.player) return

const duration = AmbientState.player.getDuration()
if (!duration) return

const time = (Number(seek.value) / 100) * duration
AmbientState.player.seekTo(time, true)
})
}

document.querySelectorAll("#categorySelector .cat-item").forEach(button => {
button.addEventListener("click", () => {
AmbientYoutube.buildCategory(button.dataset.cat)
this.closeCategorySelector()
this.setPanelMode(0)
})
})

document.addEventListener("click", (event) => {
const selector = document.getElementById("categorySelector")
if (!selector || selector.classList.contains("hidden")) return

if (
!selector.contains(event.target) &&
event.target.id !== "ambientCatBtn"
)
this.closeCategorySelector()
})

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
this.closeCategorySelector()
}
})

window.addEventListener("resize", () => {
this.constrainFloatingUI()
this.syncTicker()
})

if (!mini) return

let dragging = false
let dragMoved = false
let offsetX = 0
let offsetY = 0

mini.addEventListener("mousedown", (event) => {

if (event.target.closest("button") || event.target.closest("input")) {
return
}

dragging = true
dragMoved = false
mini.classList.add("dragging")

const rect = mini.getBoundingClientRect()
offsetX = event.clientX - rect.left
offsetY = event.clientY - rect.top

})

document.addEventListener("mousemove", (event) => {

if (!dragging) return

dragMoved = true

const x = Math.max(8, Math.min(window.innerWidth - mini.offsetWidth - 8, event.clientX - offsetX))
const y = Math.max(8, Math.min(window.innerHeight - mini.offsetHeight - 8, event.clientY - offsetY))

mini.style.left = `${x}px`
mini.style.top = `${y}px`
mini.style.bottom = "auto"

if (panel && AmbientState.panelMode === 0) {
this.positionPanelNearMini()
}

})

document.addEventListener("mouseup", () => {

if (!dragging) return

dragging = false
mini.classList.remove("dragging")

localStorage.setItem("ambientMiniX", mini.style.left)
localStorage.setItem("ambientMiniY", mini.style.top)
this.positionPanelNearMini()

setTimeout(() => {
dragMoved = false
}, 0)

})

mini.addEventListener("click", (event) => {

if (dragMoved) return
if (event.target.closest("button") || event.target.closest("input")) return

this.togglePanel()

})

},

}

window.AmbientEngine = {
onModeChange(previousMode, nextMode) {
const enteringQuestions =
previousMode !== "questions" &&
nextMode === "questions"

if (enteringQuestions) {
AmbientState.ui.panelModeBeforeQuestions = AmbientState.panelMode
AmbientState.ui.suppressedByQuestions =
AmbientState.panelMode !== 2

if (AmbientState.panelMode !== 2) {
AmbientUI.setPanelMode(2)
}

AmbientUI.closeCategorySelector()
return
}

const leavingQuestions =
previousMode === "questions" &&
nextMode !== "questions"

if (leavingQuestions) {
const restoreMode =
AmbientState.ui.panelModeBeforeQuestions
const shouldRestore =
AmbientState.ui.suppressedByQuestions &&
AmbientState.panelMode === 2 &&
restoreMode !== 2

AmbientState.ui.suppressedByQuestions = false
AmbientState.ui.panelModeBeforeQuestions = AmbientState.panelMode

if (shouldRestore) {
AmbientUI.setPanelMode(restoreMode)
}

AmbientUI.closeCategorySelector()
return
}

if (previousMode !== nextMode && AmbientState.panelMode === 0) {
AmbientUI.setPanelMode(1)
}

AmbientUI.closeCategorySelector()
},

resetUnavailableTracks() {
AmbientYoutube.resetBlockedTracks()
AmbientYoutube.buildRandomList({ autoplay: false })
AmbientUI.updateShell()
}
}

document.addEventListener("DOMContentLoaded", () => {
AmbientUI.init()
AmbientYoutube.loadCatalog()
})
