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
function notify(message) {
    chrome.notifications.create('', { type: "basic", title: "ruTorrent Remote", message: message});
}

function getTorrentFile(info, tab) {

    var promise = new Promise((resolve, reject) => {
        var request = new XMLHttpRequest();
        request.responseType = 'blob';
        request.open('GET', info.linkUrl, true);

        request.onreadystatechange = function () {
            if (request.readyState !== XMLHttpRequest.DONE) 
                return;
            if (!/\.torrent/.test(request.getAllResponseHeaders())) {
                reject(new Error('Unable to determine whether file is a torrent'));
            }

            resolve(request.response)
        }

        request.send(null);
    });

    return promise;
}
function uploadToRutorrent(response) {
    return browser.storage.local.get()
        .then((options) => {
            var promise = new Promise((resolve, reject) => {
            if (options.url == null) {
                reject(new Error("Goto Add-ons -> ruTorrent Remote -> Options and set the options."));
                return;
            }

            var formData = new FormData();
            formData.append('torrent_file', response, (Math.random() * response.size).toString() + ".torrent");

            var r = new XMLHttpRequest();
            r.timeout = 5000;
            
            var url = '';
            var auth = options.username + ':' + options.password + '@';
            if (options.username.length > 0)
                url = (options.url.replace(":\/\/", "://" + auth));
            r.open('POST', url + '/php/addtorrent.php', true);
            r.onload = function() {
                if (this.status == 200) {
                    resolve("Uploaded");
                }
                else {
                    reject(new Error("Failed to upload: " + this.status));
                }
            }
            r.ontimeout = function(e) {
                reject(new Error("Timed out"));
            }
            r.send(formData);
        });
        return promise;
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "upload-to-rutorrent") {
        getTorrentFile(info, tab)
            .then(function(response) {
                uploadToRutorrent(response)
                    .then(function(uploaded) {
                        notify(uploaded);
                    })
                    .catch(function(error) {
                        notify(error.message);
                    });
            })
            .catch(function (error) {
                notify(error.message);
            });
    }
    if (info.menuItemId === 'options-page') {
        browser.runtime.openOptionsPage()
    }
});