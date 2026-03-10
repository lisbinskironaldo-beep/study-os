const AmbientState = {

catalog: [],
visible: [],
cursor: 0,

player: null,
currentVideo: null,
playing: false,

volume: Number(localStorage.getItem("ambient_volume") || 0.6),

ui: {
panelOpen: false
},


history: [],

favorites: JSON.parse(localStorage.getItem("ambient_favorites") || "[]"),

}