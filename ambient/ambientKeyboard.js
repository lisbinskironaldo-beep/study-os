const AmbientKeyboard = {

init(){

document.addEventListener("keydown",(e)=>{

if(
e.target.tagName==="INPUT" ||
e.target.tagName==="TEXTAREA" ||
e.target.isContentEditable
){
return
}

const items = AmbientState.visible
if(!items.length) return

if(e.key==="ArrowDown"){

e.preventDefault()

AmbientState.cursor++

if(AmbientState.cursor>=items.length)
AmbientState.cursor=0

AmbientUI.renderList()

}

if(e.key==="ArrowUp"){

e.preventDefault()

AmbientState.cursor--

if(AmbientState.cursor<0)
AmbientState.cursor=items.length-1

AmbientUI.renderList()

}

if(e.key==="Enter"){

AmbientPlayer.playIndex(AmbientState.cursor)
AmbientUI.renderList()

}

if(e.key==="ArrowRight"){

AmbientPlayer.next()

}

if(e.key==="ArrowLeft"){

AmbientPlayer.prev()

}

if(e.key===" "){

e.preventDefault()

AmbientPlayer.toggle()

}

if(e.altKey && (e.key==="p" || e.key==="P")){

e.preventDefault()
AmbientPlayer.toggle()

}

if(e.key==="r" || e.key==="R"){

AmbientYoutube.buildRandomList()

}

if(e.key==="m" || e.key==="M"){

const panel=document.querySelector(".ambient-panel")

if(!panel) return

panel.style.display=
panel.style.display==="none" ? "flex" : "none"

}

if(e.altKey && e.key==="Enter"){

e.preventDefault()

const item = AmbientState.visible[AmbientState.cursor]
if(!item) return

const id = item.id

const pos = AmbientState.favorites.indexOf(id)

if(pos === -1){

AmbientState.favorites.push(id)

}else{

AmbientState.favorites.splice(pos,1)

}

localStorage.setItem(
"ambient_favorites",
JSON.stringify(AmbientState.favorites)
)

AmbientUI.renderList()

}

if(e.altKey && (e.key==="f" || e.key==="F")){

e.preventDefault()

if(!AmbientState.favorites.length) return

const favList = AmbientState.catalog
? Object.values(AmbientState.catalog)
.flat()
.filter(v=>AmbientState.favorites.includes(v.id))
: []

if(!favList.length) return

AmbientState.visible = favList.slice(0,8)
AmbientState.cursor = 0

AmbientUI.renderList()
AmbientPlayer.playIndex(0)

}

})

}

}

document.addEventListener("DOMContentLoaded",()=>{
AmbientKeyboard.init()
})