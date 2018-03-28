function saveOptions () {
    if (!/(https|http)/.test(document.querySelector('#url').value)) {
        browser.notifications.create('', { type: "basic", title: "ruTorrent Remote", message: 'URL must start with either "https" or "http"'});
        return;
    }

    browser.storage.local.set({
        url: document.querySelector('#url').value,
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value,
    });
}

function restoreOptions () {
    browser.storage.local.get(function (result) {
        document.querySelector('#url').value = result.url || '';
        document.querySelector('#username').value = result.username || '';
        document.querySelector('#password').value = result.password || '';
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
