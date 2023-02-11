hljs.highlightAll();
// Get the URL of the current page
const url = new URL(window.location.href);

// Get the value of the "name" parameter in the query string
const thread_id = url.searchParams.get("thread");

const h_template = document.querySelector("#human")
const b_template = document.querySelector("#bot")

let main = document.querySelector("#main");
let convo; let thread;
chrome.storage.local.get(['threads'], function (result) {
    let t = result.threads
	thread = getObjectById(thread_id, t)
	convo = thread.convo;
	// some of the older threads don't have a branch_state object.
	load_thread(convo);
});

function load_thread(c){
    for (let i = 0; i < c.length; i++) {
        let human = i % 2 === 0;
        //let bar = `<div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans"><button class="flex ml-auto gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button></div>`
        if (human) {
            var temp = h_template.content.cloneNode(true);
            temp.querySelector(".text").innerHTML = `<p>${c[i]}</p>`
            main.appendChild(temp)
        }
        else{
            var temp = b_template.content.cloneNode(true);
            let clipboard = `<i class="fa-regular clipboard fa-clipboard"></i>`
            //let copy_bar = `<div class="p-2 copy float-right">${clipboard} &nbsp; Copy code</div>`
            temp.querySelector(".text").innerHTML = c[i] // fixes formatting for weird code divs
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

