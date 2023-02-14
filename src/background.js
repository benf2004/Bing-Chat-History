/* Based off of ChatGPT Prompt Genius - https://github.com/benf2004/ChatGPT-Prompt-Genius
@benf2004 - https://github.com/benf2004/ - Creator
@aivct - https://github.com/aivct/ - Major Contributor
@itsmohmans - https://github.com/itsmohmans - Contributor
@Abhishek7Tech - https://github.com/Abhishek7Tech - Contributor
Code used throughout many/most files
*/

let settings;
// Listen for a click on the browser action
chrome.action.onClicked.addListener(function(tab) {
    let url = "pages/explorer.html"
    chrome.tabs.create({url: url});
});