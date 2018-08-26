import axios from 'axios'
import qs from 'qs';
import jsonToFormData from 'json-form-data';
var utilities = require('./utilities');

export class ruTorrentRemote {
    constructor(parameters) {
        let {username, password, url} = parameters;
        
        if (!username || !password || !url)
            return;
        this.cid = 0;
        this.data = [];
        this.url = url.replace(/\/$/);

        this.config = {
            auth: {
                username,
                password
            }
        };
    }

    async AddTorrent(parameters) {
        let {url, path, label} = parameters;

        if (url.startsWith('magnet')) { //link is a magnet and we should add accordingly.
            var json = {
                dir_edit: path || '',
                tadd_label: label || '',
                url: url
            };

            var response = await axios.post(this.url + '/php/addtorrent.php', jsonToFormData(json), this.config);
            if (response.status == 200)
                return true;
            return false;
        }
        else if (url.startsWith('http')) {
            let file = await axios.get(url, { responseType: 'blob' });
            if (file.data.type != 'application/x-bittorrent') {
                browser.notifications.create('', {
                    type: 'basic',
                    title: 'ruTorrent Remote',
                    iconUrl: 'images/icon-128.png',
                    message: 'Link is not a torrent or magnet'
                });
                return;
            }
            var json = {
                dir_edit: path || '',
                tadd_label: label || '',
                torrent_file: new File([file.data], Date.now().toString())
            };
            var response = await axios.post(this.url + '/php/addtorrent.php', jsonToFormData(json), this.config);
            if (response.status == 200)
                return true;
            return false;
        }
        else {
            throw new Error('Unknown URL resource');
        }
    }

    async GetTorrents() {
        let response = await axios.post(this.url + '/plugins/httprpc/action.php', qs.stringify({'mode': 'list', 'cmd': 'd.custom=addtime'}), this.config);
        
        if (response.status != 200) {
            //throw new Error('200 was not returned, further debugging required');
        }

        //We've passed all our checks and the data is OK
        if (response.data.cid == this.cid)
            return this.data;   //Our cid matches the servers cid, no need to process the old data just return it
        this.data = []; //Our cid doesn't match the servers cid, clear out the old data to let the new data in

        for (var hash in response.data.t) {  //We're now looping through each torrent in $.t
            var info = response.data.t[hash];
            var torrent = {
                name: info[4],
                status: "Unknown",
                size: utilities.ToBytes(info[5]),
                done: +(info[8] / info[5] * 100).toFixed(2),
                downloaded: utilities.ToBytes(+info[8]),
                uploaded: utilities.ToBytes(+info[9]),
                ratio: +(info[10] / 1000).toFixed(3),
                ul: utilities.ToSpeed(+info[11]),
                dl: utilities.ToSpeed(+info[12]),
                added: info[34]
            };
            if (torrent.done > 0) {
                torrent.status = 'Downloading';
            }
            if (torrent.done == 100) {
                torrent.status = 'Seeding';
            }
            if (torrent.done == 0) {
                torrent.status = 'Started';
            }
            torrent.done = torrent.done + '%';
            this.data.push(torrent);
        }
        //We've finished parsing all the data and it's all in `this.data`
        return this.data;
    }
}