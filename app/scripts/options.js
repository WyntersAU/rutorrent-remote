function saveOptions () {
    if (!/(https|http)/.test(document.querySelector('#url').value)) {
        chrome.notifications.create('', { type: "basic", title: "ruTorrent Remote", message: 'URL must start with either "https" or "http"'});
        return;
    }

    localStorage.setItem('url', document.querySelector('#url').value);
    localStorage.setItem('username', document.querySelector('#username').value);
    localStorage.setItem('password', document.querySelector('#password').value);
    localStorage.setItem('theme', document.querySelector('#theme').value);

    if (document.getElementById('savePathInput').value != '')
        addSavePath(document.getElementById('savePathInput').value);

    let paths = [];
    for (let child of document.querySelector('#savePathList').children)
        if (child.children[0].innerText != 'Default')
            paths.push(child.children[0].innerText);
    localStorage.setItem('paths', paths);

    browser.runtime.reload();
}

function removeSavePath(e) {
    e.parentNode.remove();

    let paths = [];
    for (let child of document.querySelector('#savePathList').children)
        if (child.children[0].innerText != 'Default')
            paths.push(child.children[0].innerText);
    localStorage.setItem('paths', paths);
}; 
function addSavePath(path) {
    var savePathList = document.querySelector('#savePathList');
    var li = document.createElement('li');
    var div = document.createElement('div');
    var button = document.createElement('button');

    li.className = 'savePathRow';

    div.className = 'savePathRowText';
    div.innerText = path;

    button.className = 'savePathRowButton';
    button.type = 'button';
    button.innerText = 'X';
    button.onclick = (e) => {removeSavePath(e.target);};

    li.appendChild(div);
    li.appendChild(button);
    savePathList.appendChild(li);
    

    let paths = [];
    for (let child of document.querySelector('#savePathList').children)
        if (child.children[0].innerText != 'Default')
            paths.push(child.children[0].innerText);
    localStorage.setItem('paths', paths);
};
function restoreOptions () {
    document.querySelector('#url').value = localStorage.getItem('url') || '';
    document.querySelector('#username').value = localStorage.getItem('username') || '';
    document.querySelector('#password').value = localStorage.getItem('password') || '';
    document.querySelector('#theme').value = localStorage.getItem('theme') || 'Light';

    for(let path of localStorage.getItem('paths').split(',')) {
        if (path != '')
            addSavePath(path);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    restoreOptions();

    document.getElementById('savePathButton').addEventListener('click', () => {
        addSavePath(document.getElementById('savePathInput').value);
        document.getElementById('savePathInput').value = '';
    })
});
document.querySelector("form").addEventListener("submit", saveOptions);

//<li class='savePathRow'><div class="savePathRowText">~/test</div> <button class="savePathRowButton" type="button" onclick="removeSavePath(this)">X</button></li>
