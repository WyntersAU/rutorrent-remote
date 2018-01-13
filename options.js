function saveOptions () {
    chrome.storage.local.set({
        url: document.querySelector('#url').value.replace(/(https|http)\:\/\//i, ""),
        username: document.querySelector('#username').value,
        password: document.querySelector('#password').value,
    });
}

function restoreOptions () {
    chrome.storage.local.get(function (result) {
        document.querySelector('#url').value = result.url || '';
        document.querySelector('#username').value = result.username || '';
        document.querySelector('#password').value = result.password || '';
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);