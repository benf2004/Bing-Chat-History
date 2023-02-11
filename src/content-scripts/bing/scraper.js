injectScript(chrome.runtime.getURL('content-scripts/utility.js'), 'body');

let firstTime = true;

function chatIsActive(){
    let chatStatus = document.querySelector("cib-serp")?.getAttribute("mode")
    return chatStatus === "conversation"
}

function startsWithUser(c){
    return c.querySelector(".cib-message-main").getAttribute("source") === "user"
}

function nonMessage(element) {
    if (!element) return false;

    for (let i = 0; i < element.children.length; i++) {
        if (element.children[i].classList.contains("meta-text")) return true;
        if (element.classList.contains("attributions")) return true;
        if (element.classList.contains("ignore")) return true;
    }

    return false;
}


function getShadowElements(shadowRoot) { // it kinda returns a soupy unorganized mess, but it's all there and queryable
    const fragment = new DocumentFragment();
    Array.from(shadowRoot.children).forEach(child => {
        fragment.appendChild(child.cloneNode(true));
        if (child.shadowRoot) {
            fragment.appendChild(getShadowElements(child.shadowRoot));
        }
    });
    return fragment;
}

let id;
function saveConvo() {
    if (!chatIsActive()){
        return;
    }
    let convo = []
    const chatDIV = document.querySelector("cib-serp").shadowRoot.querySelector("#cib-conversation-main").shadowRoot.querySelector("#cib-chat-main")
    let c = getShadowElements(chatDIV)
    let messages = c.querySelectorAll(".content")
    if (!startsWithUser(c)){
        messages[0].remove() // removes "Thanks for clearing my head!" message (not working)
    }
    let i = 0
    for (let message of messages){
        if (!nonMessage(message)) {
            if (i % 2 === 0) { // modulus
                convo.push(message.innerText)
            } else {
                convo.push(message.innerHTML)
            }
            i = i + 1
        }
    }
    if (firstTime){
        id = generateUUID()
        const newChatButton = document.querySelector("cib-serp").shadowRoot.querySelector("cib-action-bar").shadowRoot.querySelector(".button-compose")
        newChatButton.addEventListener("click", () => firstTime = true)
    }
    let thread = {convo: convo, title: document.title, date: getDate(), time: getTime(), id:id ?? generateUUID(), favorite: false, unified_id: false}
    if (firstTime){
        chrome.storage.local.get({threads: []}, function (result) {
            let t = result.threads
            t.push(thread)
            chrome.storage.local.set({threads: t})
        })
        firstTime = false
    }
    else {
        chrome.storage.local.get({threads: []}, function (result) {
            let t = result.threads
            t[t.length - 1] = thread
            let threadIndex = getObjectIndexByID(id, t); // this is so user can modify storage whilst thread is saving
            if (threadIndex != null){
                t[threadIndex] = thread
                chrome.storage.local.set({threads: t})
            }
        })
    }
}

setInterval(saveConvo, 2000)