import axios from 'axios';
import {ruTorrentRemote} from './ruTorrentRemote';

let ruTorrent = new ruTorrentRemote({
    username: localStorage.getItem('username'),
    password: localStorage.getItem('password'),
    url: localStorage.getItem('url')
});

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
        console.log(result);
    }
    else if (info.menuItemId === 'options-page') {
        browser.runtime.openOptionsPage()
    }
});