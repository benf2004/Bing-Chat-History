import {conversationData, getCurrentChatText, convertChatToMarkdown, downloadBlobAsFile} from "./export.js";

hljs.highlightAll();
// Get the URL of the current page
const url = new URL(window.location.href);

// Get the value of the "name" parameter in the query string
const thread_id = url.searchParams.get("thread");

const h_template = document.querySelector("#human")
const b_template = document.querySelector("#bot")

let main = document.querySelector("#main");
let thread; let convo;
chrome.storage.local.get(['threads'], function (result) {
    let t = result.threads
	thread = getObjectById(thread_id, t)
    convo = thread.convo;
	load_thread(convo);
});

function load_thread(c){
    for (let i = 0; i < c.length; i++) {
        let human = !c[i].bot
        if (human) {
            var temp = h_template.content.cloneNode(true);
            temp.querySelector(".text").innerHTML = `<p>${c[i].text}</p>`
            main.appendChild(temp)
        }
        else {
            var temp = b_template.content.cloneNode(true);
            let clipboard = `<i class="fa-regular clipboard fa-clipboard"></i>`
            let copy_bar = `<div class="p-2 copy float-right">${clipboard} &nbsp; Copy code</div>`
            temp.querySelector(".text").innerHTML = c[i].text.replaceAll(`<pre>`, `<pre> ${copy_bar}`) // keep chatGPT code styling for now
            main.appendChild(temp)
        }
    }
    copy_setup();
}

// Add the right event listeners for the little copy clipboard in code blocks.
function copy_setup() { // created by ChatGPT
    const clipboardBars = document.querySelectorAll('.copy');
    const codeElements = document.querySelectorAll('pre code');

// Add a click event listener to each clipboard bar
    clipboardBars.forEach((clipboardBar, index) => {
        clipboardBar.addEventListener('click', async () => {
            let clipboard = `<i class="fa-regular clipboard fa-clipboard"></i>`
            let copy_bar = `<div class="p-2 copy float-right">${clipboard} &nbsp; Copy code</div>`
            clipboardBar.innerHTML = `<icon class="fa-regular fa-check"></icon> &nbsp; Copied!`;
            setTimeout(() => {clipboardBar.outerHTML = copy_bar; copy_setup()}, 2000);
            // Get the code element corresponding to the clicked clipboard bar
            const codeElement = codeElements[index];

            // Get the text content of the code element
            const text = codeElement.textContent;

            // Copy the text to the clipboard
            await navigator.clipboard.writeText(text);
        });
    });
}


// SHARE LINK BUTTON
async function shareGPTLink() {
    let cd = conversationData(convo);
    const res = await fetch("https://sharegpt.com/api/conversations", {
        body: JSON.stringify(cd),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    });
    const {id} = await res.json();
    const url = `https://shareg.pt/${id}`; // short link to the ShareGPT post
    window.open(url, "_blank");
}

document.getElementById("link").addEventListener("click", shareGPTLink)

// EXPORT MD BUTTON
function exportMD(){
    // The title should be date of the chat, "Bing Conversation" plus the title of the thread in a stubbified format. We have thread.date, thread.time and thread.title available to us.
    // Lets load thread time and date into a Date object. Thread date is stored as "DD Mon YYYY" and Time doesn't have a leading zero and stored in 12 hour format
    let date = thread.date.split(" ");
    let time = thread.time.split(" "); //this extracts the am/pm
    let hour = time[0].split(":")[0];
    let minute = time[0].split(":")[1];
    let ampm = time[1];
    let year = date[2];
    let month = date[1];
    let day = date[0];
    //use Date.parse to construct the date object
    let d = Date.parse(`${month} ${day}, ${year} ${hour}:${minute} ${ampm}`);
    // make it an isoFormat
    let isoDateTime = new Date(d).toISOString();

    let threadTitle = `${isoDateTime}_Bing-Conversation_${thread.title}`;
    // for fileName, make a stub using regular expresisons to allow only valid characters through. And remove any trailing _ before appending .md
    let fileName = threadTitle.replace(/[^a-z0-9]/gi, '_').replace(/_$/g, "") + ".md";
    
    let data = getCurrentChatText(convo);

    let blob = convertChatToMarkdown(data, "Bing Conversation");
    downloadBlobAsFile(blob, fileName);
}

document.getElementById("markdown").addEventListener("click", exportMD)