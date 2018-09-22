import { TorrentClient } from "./torrentClient"
import { ThrowClassNotification } from '../utilities'
import { ToBytes, ToSpeed, toFormData } from '../utilities'
import axios from 'axios'
import qs from 'qs'

export class ruTorrentClient extends TorrentClient {
    constructor(parameters) {
        super(parameters);
        if (parameters.url)
            parameters.url = parameters.url.replace(/\/$/, ''); //Removes trailing forward-slash.

        this.info = {
            'canAddTorrentUrl' : true,        
            'canAddTorrentMagnet': true,
            'canGetTorrents': true,

            'name': 'ruTorrent',
            'className': 'ruTorrentClient'
        };

        this.url = parameters.url;
        this.config = {
            auth: {
                username: parameters.username,
                password: parameters.password
            }
        }
    }

    async GetTorrents() {
        let response = await axios.post(this.url + '/plugins/httprpc/action.php', qs.stringify({'mode': 'list', 'cmd': 'd.custom=addtime'}), this.config);

        if (response.status != 200) 
            return ThrowClassNotification(this.info.className, 'GetTorrents', 'Response from ruTorrent was {0}'.format(response.status));
        if (response.data.cid == this.cid)
            return this.data;
        this.data = [];

        for (var hash in response.data.t) {
            var info = response.data.t[hash];
            var torrent = {
                name: info[4],
                status: "Unknown",
                size: ToBytes(info[5]),
                done: +(info[8] / info[5] * 100).toFixed(2),
                downloaded: ToBytes(+info[8]),
                uploaded: ToBytes(+info[9]),
                ratio: +(info[10] / 1000).toFixed(3),
                ul: ToSpeed(+info[11]),
                dl: ToSpeed(+info[12]),
                added: info[34]
            };
            if (torrent.name == undefined)  //Fixes issue with rutorrent returning undefined torrents
                continue;
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
        return this.data;
    }

    async AddTorrent(parameters = null) {
        let {url, path, label} = parameters;

        if (url.startsWith('magnet')) {
            this.addTorrentMagnet(parameters);
        }
        else if (url.startsWith('http'))
            this.addTorrentUrl(parameters);
        else
            ThrowClassNotification(this.info.className, 'AddTorrent', '')
    }
    async addTorrentUrl(parameters) {
        let {url, path, label} = parameters;
        let file = await axios.get(url, { responseType: 'blob' });
        let json = { dir_edit: path || '', tadd_label: label || '', torrent_file: new File([file.data], Date.now().toString()) };

        if (file.data.type != 'application/x-bittorrent') 
            return ThrowClassNotification(this.info.className, 'addTorrentUrl', '__MSG_notValidBitTorrent__');
        let response = await axios.post(this.url + '/php/addtorrent.php', toFormData(json), this.config);

        if (response.status == 200)
            return true;
        return ThrowClassNotification(this.info.className, 'addTorrentUrl', 'Didn\'t get');
    }
    async addTorrentMagnet(parameters) {
        let {url, path, label} = parameters;
        let json = { dir_edit: path || '', tadd_label: label || '',  url: url };
    }
}