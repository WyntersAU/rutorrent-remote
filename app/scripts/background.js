import axios from 'axios';
import { ruTorrentClient } from './clients/ruTorrentClient'
import { GetBrowser } from './utilities'

window.addEventListener('storage', (e) => {

});

if (localStorage.getItem('authenticated')) {
    let ruTorrent = new ruTorrentClient({
        username: localStorage.getItem('username'),
        password: localStorage.getItem('password'),
        url: localStorage.getItem('url')
    });

    setInterval(async () => {
        let data = await ruTorrent.GetTorrents();
        browser.runtime.sendMessage({ state: 'torrents', data });
    }, 1000);
}

/*let listener = browser.runtime.onMessage.addListener((message) => {

});*/


browser.contextMenus.create({
    id: "upload-to-rutorrent",
    title: "Upload to ruTorrent",
    contexts: ["link"],  
});
browser.contextMenus.create({
    id: 'options-page',
    title: 'Options Page',
    contexts: ['browser_action']
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "upload-to-rutorrent") {
        var result = await ruTorrent.AddTorrent({
            url: info.linkUrl
        });
        browser.notifications.create('', {
        	type: 'basic',
        	title: 'ruTorrent Remote',
        	iconUrl: 'images/icon-128.png',
        	message: result ? 'Torrent has been uploaded' : 'Torrent failed to upload'
        });
    }
    else if (info.menuItemId === 'options-page') {
        if (GetBrowser() == 'Firefox')
            browser.runtime.openOptionsPage()
    }
});