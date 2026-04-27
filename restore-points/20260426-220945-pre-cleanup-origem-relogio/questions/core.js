fetch("questions/questions.html")
.then(r => r.text())
.then(html => {

document.getElementById("questionsModule").innerHTML = html

const contextScript = document.createElement("script")
contextScript.src = "questions/questions.context.js"

contextScript.onload = () => {

const storeScript = document.createElement("script")
storeScript.src = "questions/questions.store.js"

storeScript.onload = () => {

const stateScript = document.createElement("script")
stateScript.src = "questions/questions.state.js"

stateScript.onload = () => {

const serviceScript = document.createElement("script")
serviceScript.src = "questions/questions.service.js"

serviceScript.onload = () => {

const uiScript = document.createElement("script")
uiScript.src = "questions/questions.ui.js"

uiScript.onload = () => {

const mainScript = document.createElement("script")
mainScript.src = "questions/questions.js"

mainScript.onload = () => {

if (window.QuestionsPage) {
QuestionsPage.init()
}

}

document.body.appendChild(mainScript)

}

document.body.appendChild(uiScript)

}

document.body.appendChild(serviceScript)

}

document.body.appendChild(stateScript)

}

document.body.appendChild(storeScript)

}

document.body.appendChild(contextScript)

})