var utilities = require("utilities.js");

chrome.contextMenus.create({
    id: "upload-to-rutorrent",
    title: "Upload to ruTorrent",
    contexts: ["link"],
});
chrome.contextMenus.create({
    id: 'options-page',
    title: 'Options Page',
    contexts: ['browser_action']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "upload-to-rutorrent") {

    }
    if (utilities.GetBrowser() == 'Firefox') {
        if (info.menuItemId === 'options-page') {
            browser.runtime.openOptionsPage()
        }
    }
});