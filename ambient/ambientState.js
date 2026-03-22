const AmbientState = {

catalog: [],
visible: [],
cursor: 0,

player: null,
currentVideo: null,
playing: false,
pendingVideoId: null,

volume: Number(localStorage.getItem("ambient_volume") || 0.6),
lastTime: Number(localStorage.getItem("ambient_last_time") || 0),

ui: {
panelOpen: false,
helpOpen: false,
categoryMenuOpen: false,
blockedOpen: false
},

favoritesMode: false,

history: [],
blockedTrackIds: JSON.parse(localStorage.getItem("ambient_blocked_tracks") || "[]"),

favorites: JSON.parse(localStorage.getItem("ambient_favorites") || "[]"),

panelMode: 1,

}
