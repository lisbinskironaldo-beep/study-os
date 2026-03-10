const AmbientYoutube = {

async loadCatalog(){

const res = await fetch("data/youtube-catalog.json")
const data = await res.json()

AmbientState.catalog = data

this.buildRandomList()

},

buildRandomList(){

const all = []

Object.values(AmbientState.catalog).forEach(list=>{
list.forEach(v=>all.push(v))
})

const shuffled = this.shuffle(all)

const favBoost = shuffled.filter(v=>AmbientState.favorites.includes(v.id))
const rest = shuffled.filter(v=>!AmbientState.favorites.includes(v.id))

const boosted = [...favBoost, ...rest]

/* evitar repetir músicas recentes */

let filtered = boosted.filter(v => !AmbientState.history.includes(v.id))

if(filtered.length < 8){
AmbientState.history = []
filtered = shuffled
}

/* nova lista */

AmbientState.visible = filtered.slice(0,8)

AmbientState.cursor = 0

AmbientUI.renderList()

const last = localStorage.getItem("ambient_last_video")

if(last){

const idx = AmbientState.visible.findIndex(v=>v.id===last)

if(idx !== -1){
AmbientPlayer.playIndex(idx)
return
}

}

AmbientPlayer.playIndex(0)

},

shuffle(arr){

return arr
.map(v=>({v, r:Math.random()}))
.sort((a,b)=>a.r-b.r)
.map(o=>o.v)

}

}