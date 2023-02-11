let settings;
// Listen for a click on the browser action
chrome.action.onClicked.addListener(function(tab) {
    let url = "pages/explorer.html"
    chrome.tabs.create({url: url});
});