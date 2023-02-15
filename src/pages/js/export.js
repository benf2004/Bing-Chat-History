export function conversationData(c) {
    var result = {
        avatarUrl: getAvatarImage(),
        items: [],
    };
    console.log(c)
    for (let i = 0; i < c.length; i++) {
        let message = c[i]
        let text;
        if (message.bot === false) {
            if (i === 0){
                let preamble = `~The following is a conversation with Bing, not ChatGPT.~`
                text = preamble + message.text
            }
            else {
                text = message.text
            }
            result.items.push({
                from: "human",
                value: text,
            });
        }
        else {
            result.items.push({
                from: "gpt",
                value: message.text,
            });
        }
    }
    return result;
}

function getAvatarImage() {
    return "data:image/jpeg;base64,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";
}

function htmlToMDSyntax(html) { // accounts for an edge case where chatgpt produces both an ordered list and an unordered list when exporting
    let newh =  html
        .replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')  // Convert <a> tags to markdown syntax
        .replace(/<[^>]* (class|id|style|target|title|rel)="[^"]*"[^>]*>/g, '')   // Remove all classes and attributes
        .replaceAll(`<pre><code>`, "```\n")
        .replaceAll(`</code></pre>`, "```\n")
        .replaceAll(`<pre>`, "```\n")
        .replaceAll(`<code>`, '\`')
        .replaceAll(`</code>`, '\`')
        .replaceAll(`<p>`, '\n')
        .replaceAll(`</p>`, '\n')
        .replaceAll(`<h1>`, '# ')
        .replaceAll(`</h1>`, '')
        .replaceAll(`<h2>`, '## ')
        .replaceAll(`</h2>`, '')
        .replaceAll(`<h3>`, '### ')
        .replaceAll(`</h3>`, '')
        .replaceAll(`<strong>`, '**')
        .replaceAll(`</strong>`, "**")
        .replaceAll(`<span>`, "")
        .replaceAll(`</span>`, "")


    let isOrderedList = html.includes('<ol>');
    let isUnorderedList = html.includes('<ul>');

    if (isOrderedList){
        newh = newh
            .replaceAll(`<ol>`, `<ol class="ordered-list">`)
            .replaceAll(`</ol>`, `</ol>`);

        let parser = new DOMParser();
        let doc = parser.parseFromString(newh, 'text/html');
        let orderedListItems = doc.querySelectorAll('.ordered-list li');
        for (let i = 0; i < orderedListItems.length; i++) {
            orderedListItems[i].innerHTML = `${i + 1}. ` + orderedListItems[i].innerHTML;
        }
        newh = doc.body.innerHTML
            .replaceAll(`<ol class="ordered-list">`, "\n")
            .replaceAll(`</ol>`, "\n")
            .replaceAll(`</li>`, "\n")
    }
    if (isUnorderedList){
        newh = newh
            .replaceAll(`<ul>`, `<ul class="unordered-list">`)
            .replaceAll(`</ul>`, `</ul>`);

        let parser = new DOMParser();
        let doc = parser.parseFromString(newh, 'text/html');
        let unorderedListItems = doc.querySelectorAll('.unordered-list li');
        for (let i = 0; i < unorderedListItems.length; i++) {
            unorderedListItems[i].innerHTML = `- ` + unorderedListItems[i].innerHTML;
        }
        newh = doc.body.innerHTML
            .replaceAll(`<ul class="unordered-list">`, "\n")
            .replaceAll(`</ul>`, "\n")
            .replaceAll(`</li>`, "\n")
    }
    newh = newh.replaceAll(`<li>`, "")

    return newh
}

function getChatBubbleText(chatBubble, isHuman)
{
    let text;
    if(isHuman)
    {
        // for code
        text = `\n ${chatBubble.replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;").trim()}`;
    }
    else
    {
        text = htmlToMDSyntax(chatBubble) // saves as html
    }
    return text;
}

export function getCurrentChatText(c)
{
    let chat = [];

    for(let i = 0; i < c.length; i++)
    {
        chat.push(getChatBubbleText(c[i].text, !c[i].bot))
    }

    return chat;
}

function encodeStringAsBlob(string)
{
    let bytes = new TextEncoder().encode(string);
    let blob = new Blob([bytes], {
        type: "application/json;charset=utf-8"
    });
    return blob;
}

export const downloadBlobAsFile = (function()
{
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, file_name)
    {
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = file_name;
        a.click();
        window.URL.revokeObjectURL(url);
    }
})();

export function convertChatToMarkdown(chat, title)
{
    let string = "";
    if(title)
    {
        string += "# " + title + "\n";
    }
    else
    {
        string += "# " + "ChatGPT Conversation" + "\n";
    }
    string += "\n"; // two newlines because MD is like that
    let convo = chat;
    for(let i = 0; i < convo.length; i++)
    {
        let speaker = i % 2 === 0 ? "Human" : "Assistant";
        string += "**" + speaker + ":**\n";
        string += convo[i] + "\n";
        string += "\n";
        string += "***\n";
        string += "\n";
    }

    // timestamp
    let date = getDate();
    let time = getTime();

    string += "Exported on " + date + " " + time + ".";

    let blob = encodeStringAsBlob(string);
    return blob;
}