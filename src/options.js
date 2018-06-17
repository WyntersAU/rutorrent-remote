function saveOptions () {
    if (!/(https|http)/.test(document.querySelector('#url').value)) {
        chrome.notifications.create('', { type: "basic", title: "ruTorrent Remote", message: 'URL must start with either "https" or "http"'});
        return;
    }

    localStorage.setItem('url', document.querySelector('#url').value);
    localStorage.setItem('username', document.querySelector('#username').value);
    localStorage.setItem('password', document.querySelector('#password').value);
    localStorage.setItem('theme', document.querySelector('#theme').value);
}

function restoreOptions () {
    document.querySelector('#url').value = localStorage.getItem('url') || '';
    document.querySelector('#username').value = localStorage.getItem('username') || '';
    document.querySelector('#password').value = localStorage.getItem('password') || '';
    document.querySelector('#theme').value = localStorage.getItem('theme') || 'Light';
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
