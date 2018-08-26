import qs from 'qs';
import jsonToFormData from 'json-form-data';
import axios from 'axios';

//https://stackoverflow.com/a/18650828
export function ToBytes(bytes, decimals) {
	if(bytes == 0) return '0 B';
	var k = 1024,
	    dm = decimals || 2,
	    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	    i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function ToSpeed(bytes, decimals) {
  if(bytes == 0) return '0 B/s';
  var k = 1024,
      dm = decimals || 2,
      speeds = ['B/s', 'KB/s', 'MB/s', 'GB/s', 'TB/s', 'PB/s', 'EB/s', 'ZB/s', 'YB/s'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + speeds[i];
}

//https://stackoverflow.com/a/45985333
export function GetBrowser() {
    if (typeof chrome !== "undefined") {
        if (typeof browser !== "undefined") {
            return "Firefox";
        } else {
            return "Chrome";
        }
    } else {
        return "Edge";
    }
}

function removeSavePath(e) {
    e.parentNode.remove();
}
function addSavePath(path) {
    var savePathList = document.getElementById('savePathList');
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
}

export async function makeRPCall(parameters) {
    var options = {
        'url': (localStorage.getItem('url') + '/plugins/httprpc/action.php' || ''),
        'method': 'post',
        'headers': {'content-type': 'application/x-www-form-urlencoded'},
        'auth': {
            'username': localStorage.getItem('username') || '',
            'password': localStorage.getItem('password') || ''
        },
        'data': qs.stringify(parameters)
    };
    var result = null;

    try {
        result = (await axios(options)).data;
    }
    catch (e) {
        if (e.message == 'Network Error') {
            this.throwError('Invalid URL');
        }
        else if (e.response.status == 401) {
            this.throwError('Invalid username or password');
        }
        else if (e.response.status != 200 || e.response == undefined) {
            this.throwError('An unknown error occurred ');
        }
        return;
    }
    return result;
}

export function toFormData(fd) {
    return jsonToFormData(fd);
}
export function toQueryString(qs) {
    return qs.stringify(qs);
}