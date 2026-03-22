const AmbientPlayer = {

progressInterval: null,

playIndex(i) {

const item = AmbientState.visible[i]
if (!item || !item.id) return

AmbientState.currentVideo = item.id
AmbientState.pendingVideoId = item.id
AmbientState.cursor = i

localStorage.setItem("ambient_last_video", item.id)

if (!AmbientState.history.includes(item.id)) {
AmbientState.history.push(item.id)
}

if (AmbientState.history.length > 20) {
AmbientState.history.shift()
}

AmbientState.lastTime = 0
localStorage.setItem("ambient_last_time", 0)

this.loadVideo(item.id)
AmbientUI.renderList()
AmbientUI.updateShell()

},

loadVideo(id) {

AmbientState.pendingVideoId = id

if (!window.YT || !YT.Player) {
AmbientUI.updateShell()
return
}

if (!AmbientState.player) {

AmbientState.player = new YT.Player("youtubePlayer", {
height: "0",
width: "0",
videoId: id,

playerVars: {
autoplay: 1,
controls: 0,
rel: 0
},

events: {

onReady: (event) => {

event.target.setVolume(AmbientState.volume * 100)
event.target.playVideo()

if (AmbientState.lastTime) {
event.target.seekTo(AmbientState.lastTime, true)
}

},

onStateChange: (event) => {

if (event.data === YT.PlayerState.ENDED) {
this.next()
return
}

if (event.data === YT.PlayerState.PLAYING) {
this.setPlayingState(true)
this.startProgress()
return
}

if (
event.data === YT.PlayerState.UNSTARTED ||
event.data === YT.PlayerState.PAUSED ||
event.data === YT.PlayerState.CUED
) {
this.setPlayingState(false)
}

},

onError: (event) => {

this.setPlayingState(false)
this.stopProgress()
AmbientYoutube.handlePlaybackError(
AmbientState.currentVideo || AmbientState.pendingVideoId,
event.data
)

}

}
})

return

}

this.setPlayingState(false)
AmbientState.player.loadVideoById({
videoId: id,
startSeconds: AmbientState.lastTime || 0
})

AmbientState.player.playVideo()

},

toggle() {

if (!AmbientState.player) {
if (AmbientState.visible.length) {
this.playIndex(AmbientState.cursor || 0)
}
return
}

if (AmbientState.playing) {
AmbientState.player.pauseVideo()
this.setPlayingState(false)
return
}

AmbientState.player.playVideo()
this.setPlayingState(true)
this.startProgress()

},

next() {

let index = AmbientState.cursor + 1

if (index >= AmbientState.visible.length) {
AmbientYoutube.buildRandomList()
return
}

this.playIndex(index)

},

prev() {

let index = AmbientState.cursor - 1

if (index < 0) {
index = AmbientState.visible.length - 1
}

if (index < 0) return

this.playIndex(index)

},

setPlayingState(playing) {

AmbientState.playing = playing
AmbientUI.updateShell()

if (!playing) {
this.stopProgress()
}

},

startProgress() {

this.stopProgress()

this.progressInterval = setInterval(() => {

if (!AmbientState.player || !AmbientState.playing) return

const current = AmbientState.player.getCurrentTime()
const duration = AmbientState.player.getDuration()

AmbientState.lastTime = current
localStorage.setItem("ambient_last_time", current)

if (!duration || duration === Infinity) return

const seek = document.getElementById("ambientSeek")
const currentLabel = document.getElementById("ambientTimeCurrent")
const durationLabel = document.getElementById("ambientTimeTotal")

if (seek) {
seek.value = (current / duration) * 100
}

if (currentLabel) {
currentLabel.textContent = this.formatTime(current)
}

if (durationLabel) {
durationLabel.textContent = this.formatTime(duration)
}

}, 500)

},

stopProgress() {

if (this.progressInterval) {
clearInterval(this.progressInterval)
this.progressInterval = null
}

},

formatTime(seconds) {

const total = Math.floor(seconds)
const hours = Math.floor(total / 3600)
const minutes = Math.floor((total % 3600) / 60)
const secs = total % 60

if (hours > 0) {
return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

return `${minutes}:${String(secs).padStart(2, "0")}`

}

}

window.onYouTubeIframeAPIReady = () => {
if (AmbientState.pendingVideoId) {
AmbientPlayer.loadVideo(AmbientState.pendingVideoId)
}
}
