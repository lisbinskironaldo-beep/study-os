const AmbientKeyboard = {

init() {

document.addEventListener("keydown", (event) => {
this.handleKeydown(event)
})

},

handleKeydown(event) {

if (event.key === "?") {
event.preventDefault()
AmbientUI.toggleHelp()
return
}

if (
event.target.tagName === "INPUT" ||
event.target.tagName === "TEXTAREA" ||
event.target.isContentEditable
) {
return
}

if (event.key === "Escape") {
if (AmbientUI.closeBlockedTracks()) {
return
}

if (AmbientUI.closeHelp()) {
return
}

AmbientUI.setPanelMode(2)
return
}

if (event.altKey && (event.key === "m" || event.key === "M")) {
event.preventDefault()
AmbientUI.setPanelMode((AmbientState.panelMode + 1) % 3)
return
}

if (event.altKey && (event.key === "f" || event.key === "F")) {
event.preventDefault()

if (AmbientState.favoritesMode) {
AmbientYoutube.buildRandomList()
} else {
AmbientYoutube.buildFavoritesList()
}

return
}

if (event.altKey && (event.key === "s" || event.key === "S")) {
event.preventDefault()
AmbientYoutube.buildRandomList()
return
}

if (event.altKey && (event.key === "t" || event.key === "T")) {
event.preventDefault()
AmbientUI.toggleBlockedTracks()
return
}

if (event.altKey && (event.key === "k" || event.key === "K")) {
event.preventDefault()
AmbientUI.toggleCategorySelector()
AmbientUI.setPanelMode(0)
return
}

if (event.altKey && event.key === "Enter") {
event.preventDefault()

const item = AmbientState.visible[AmbientState.cursor]
if (!item) return

AmbientUI.toggleFavorite(item.id)
return
}

if (event.code === "Space" && !event.altKey) {
if (!AmbientState.player && !AmbientState.visible.length) return

event.preventDefault()
AmbientPlayer.toggle()
return
}

if (event.key === "ArrowRight" && AmbientState.visible.length) {
event.preventDefault()
AmbientPlayer.next()
return
}

if (event.key === "ArrowLeft" && AmbientState.visible.length) {
event.preventDefault()
AmbientPlayer.prev()
return
}

if (event.key === "ArrowDown" && AmbientState.visible.length) {
event.preventDefault()

AmbientState.cursor =
(AmbientState.cursor + 1) % AmbientState.visible.length

AmbientUI.renderList()
return
}

if (event.key === "ArrowUp" && AmbientState.visible.length) {
event.preventDefault()

AmbientState.cursor =
(AmbientState.cursor - 1 + AmbientState.visible.length) %
AmbientState.visible.length

AmbientUI.renderList()
return
}

if (event.key === "Enter" && AmbientState.visible.length) {
event.preventDefault()
AmbientPlayer.playIndex(AmbientState.cursor)
}

}

}

document.addEventListener("DOMContentLoaded", () => {
AmbientKeyboard.init()
})
