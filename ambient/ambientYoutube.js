const AmbientYoutube = {

async loadCatalog() {

const res = await fetch("data/youtube-catalog.json")
const data = await res.json()

AmbientState.catalog = data || {}

Object.keys(AmbientState.catalog).forEach(cat => {

const list = AmbientState.catalog[cat]
if (!Array.isArray(list)) return

list.forEach(item => {
if (!item || !item.id) return
item.category = cat
})

})

this.buildRandomList({ autoplay: false })

},

collectAll() {

const all = []

Object.values(AmbientState.catalog || {}).forEach(list => {
if (!Array.isArray(list)) return

list.forEach(item => {
if (item && item.id && item.title) {
all.push(item)
}
})
})

const seen = new Set()

return all.filter(item => {
if (seen.has(item.id)) return false
seen.add(item.id)
return true
})

},

isBlocked(id) {

return Boolean(id) && AmbientState.blockedTrackIds.includes(id)

},

persistBlockedTracks() {

localStorage.setItem(
"ambient_blocked_tracks",
JSON.stringify(AmbientState.blockedTrackIds)
)

},

markTrackBlocked(id) {

if (!id || this.isBlocked(id)) return false

AmbientState.blockedTrackIds.push(id)
this.persistBlockedTracks()
return true

},

resetBlockedTracks() {

AmbientState.blockedTrackIds = []
localStorage.removeItem("ambient_blocked_tracks")

},

filterPlayable(source) {

return source.filter(item =>
item &&
item.id &&
item.title &&
!this.isBlocked(item.id)
)

},

getBlockedTracks() {

const catalog = new Map(
this.collectAll().map(item => [item.id, item])
)

return AmbientState.blockedTrackIds.map(id => {
const item = catalog.get(id)

return {
id,
title: item?.title || "Faixa indisponivel",
category: item?.category || "catalogo"
}
})

},

setVisibleList(source, { autoplay = true } = {}) {

const list = source
.filter(item => item && item.id && item.title)
.filter(item => !this.isBlocked(item.id))
.slice(0, 13)

AmbientState.visible = list
AmbientState.cursor = 0

AmbientUI.renderList()

if (!list.length) {
AmbientUI.updateShell()
return
}

const lastVideo = AmbientState.currentVideo || localStorage.getItem("ambient_last_video")
const lastIndex = lastVideo
? list.findIndex(item => item.id === lastVideo)
: -1

if (lastIndex >= 0) {
AmbientState.cursor = lastIndex
AmbientUI.renderList()

if (autoplay) {
AmbientPlayer.playIndex(lastIndex)
} else {
AmbientUI.updateShell()
}

return
}

if (autoplay) {
AmbientPlayer.playIndex(0)
return
}

AmbientUI.updateShell()

},

buildRandomList({ autoplay = true } = {}) {

const all = this.collectAll()
const shuffled = this.shuffle(all)

let filtered = shuffled.filter(
item =>
!this.isBlocked(item.id) &&
!AmbientState.history.slice(-20).includes(item.id)
)

if (filtered.length < 8) {
AmbientState.history = []
filtered = shuffled.filter(item => !this.isBlocked(item.id))
}

let list = filtered.slice(0, 13)

if (list.length < 10) {
const fallback = shuffled.filter(
item => !list.find(entry => entry.id === item.id)
)

list = list.concat(fallback.slice(0, 10 - list.length))
}

AmbientState.favoritesMode = false
this.setVisibleList(list, { autoplay })

},

buildCategory(cat) {

const source = AmbientState.catalog?.[cat]
if (!Array.isArray(source) || !source.length) return

AmbientState.favoritesMode = false
this.setVisibleList(this.shuffle(source))

},

buildFavoritesList() {

if (!AmbientState.favorites.length) {
AmbientState.visible = []
AmbientState.cursor = 0
AmbientState.favoritesMode = true
AmbientUI.renderList()
AmbientUI.updateShell()
return
}

const list = this.collectAll().filter(
item => AmbientState.favorites.includes(item.id)
)

AmbientState.favoritesMode = true
this.setVisibleList(list)

},

handlePlaybackError(id, errorCode) {

const safeToBlock = [2, 100, 101, 150].includes(errorCode)
if (safeToBlock) {
this.markTrackBlocked(id)
}

AmbientState.playing = false
AmbientState.pendingVideoId = null
AmbientState.lastTime = 0
localStorage.setItem("ambient_last_time", 0)

if (id) {
AmbientState.visible = AmbientState.visible.filter(item => item.id !== id)
}

if (AmbientState.currentVideo === id) {
AmbientState.currentVideo = null
}

if (AmbientState.cursor >= AmbientState.visible.length) {
AmbientState.cursor = Math.max(0, AmbientState.visible.length - 1)
}

AmbientUI.renderList()
AmbientUI.updateShell()

if (AmbientState.visible.length) {
AmbientPlayer.playIndex(AmbientState.cursor)
return
}

this.buildRandomList({ autoplay: true })

},

shuffle(arr) {

return [...arr]
.map(item => ({ item, weight: Math.random() }))
.sort((a, b) => a.weight - b.weight)
.map(entry => entry.item)

}

}
