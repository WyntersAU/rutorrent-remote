function saveOptions () {
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

if (!browser.storage.get(function (result) {
    if (!result.url.test("https|http")) {
        browser.notifications.create('', { type: "basic", title: "ruTorrent Remote", message: 'URL must start with either "https" or "http"'});
    }
    else {
        document.addEventListener("DOMContentLoaded", restoreOptions);
        document.querySelector("form").addEventListener("submit", saveOptions);
    }
});
