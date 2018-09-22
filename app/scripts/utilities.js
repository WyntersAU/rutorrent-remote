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
Object.prototype.toFormData = function() {
    return toFormData(this);
}
Object.prototype.toQueryString = function() {
    return toQueryString(this);
}
export function ThrowNotification(error) {
    browser.notifications.create(error, {
        type: 'basic', title: 'ruTorrent Remote', iconUrl: 'images/icon-128.png',
        message: error
    });
    return false;
}
export function ThrowClassNotification(className, method, error = null) {
    browser.notifications.create(error, {
        type: 'basic', title: 'ruTorrent Remote', iconUrl: 'images/icon-128.png',
        message: '[{0}]->{1}: {2}'.format(className, method, error)
    });
    return false;
}

/*

    [
        [
            'd.directory',
            [ '176ADC8991EB91504B0CDF4D52634415384C1E34' ]
        ],
        [
            'd.directory',
            [ '2D8F85F87897A24BA4D20DB093A01136345623E7' ]
        ]
    ]
*/

String.prototype.format = function () {
    var a = this;
    for (var k in arguments) {
        a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
    }
    return a;
}
function BuildRPC(content) {
    let rpc = '<?xml version="1.0" encoding="UTF-8"?><methodCall><methodName>system.multicall</methodName><params><param><value><array><data>';
    for (method of content) {
        rpc += '<value><struct><member><name>methodName</name><value><string>{0}</string></value></member><member><name>params</name><value><array><data>'.format(method[0]);
        if (method[1]) {
            for (argument of method[1]) {
                rpc += '<value><{0}>{1}</{0}></value>'.format(typeof((argument) == 'number' ? 'int' : 'string'), argument.toString())
            }
        }
        rpc += `</data></array></value></member></struct></value>`;
    }
    rpc += '</data></array></value></param></params></methodCall>';
    
    return rpc;
}

function ParseRPC(rpc) {
    let matches = /<string>(.*)<\/string>|<i\d>(.*)<\/i\d>/g.exec(rpc);
}