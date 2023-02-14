injectScript(chrome.runtime.getURL('content-scripts/utility.js'), 'body');

let firstTime = true;

function chatIsActive(){
    let chatStatus = document.querySelector("cib-serp")?.getAttribute("mode")
    return chatStatus === "conversation"
}

function startsWithUser(c){
    return c.querySelector(".cib-message-main").getAttribute("source") === "user"
}

function getShadowElements(shadowRoot) { // created by ChatGPT (not Bing)
    const fragment = new DocumentFragment();
    Array.from(shadowRoot.children).forEach(child => {
        const clone = child.cloneNode(true);
        if (child.shadowRoot) {
            clone.appendChild(getShadowElements(child.shadowRoot));
        }
        fragment.appendChild(clone);
    });
    return fragment;
}


let id;
function saveConvo() {
    if (!chatIsActive()){
        return;
    }
    let convo = []
    let chatDIV = document.querySelector("cib-serp").shadowRoot.querySelector("#cib-conversation-main").shadowRoot.querySelector("#cib-chat-main")
    let c = getShadowElements(chatDIV)
    let messages = c.querySelectorAll("cib-message-group")
    if (!startsWithUser(c)){
        messages[0].remove()
    }
    let firstUser = true;
    let title;
    for (let message of messages){
        let source = message.getAttribute("source")
        if (source === "user"){
            let userMessages = message.querySelectorAll('.content') // could only be 2+ user messages in a row, so no need to do this for bots
            for (let each of userMessages){
                let text = each.innerText
                convo.push({"text": text, "bot": false})
                if (firstUser) {
                    title = text
                    firstUser = false;
                }
            }
        }
        else if (source === "bot") {
            let text = message.querySelector(`.cib-message-main[type="text"]`)?.querySelector(`.ac-textBlock`)
            if (text !== null) {
                convo.push({"text": text.innerHTML, "bot": true})
            }
        }
}
    if (firstTime){
        id = generateUUID()
        const newChatButton = document.querySelector("cib-serp").shadowRoot.querySelector("cib-action-bar").shadowRoot.querySelector(".button-compose")
        newChatButton.addEventListener("click", () => firstTime = true)
    }
    let thread = {convo: convo, title: title ?? document.title, date: getDate(), time: getTime(), id:id ?? generateUUID(), favorite: false, unified_id: false}
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

setInterval(saveConvo, 3000)