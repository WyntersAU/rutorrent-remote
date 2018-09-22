import axios from 'axios'
import qs from 'qs'
import {ThrowNotification, ThrowClassNotification} from '../utilities'

export class TorrentClient {
    constructor(parameters) {    
        this.info = {
            'canAddTorrentUrl' : false,        
            'canAddTorrentMagnet': false,
            'canGetTorrents': false,

            'name': null,
            'className': 'TorrentClient'
        };

        if (parameters.url)
            parameters.url = parameters.url.replace(/\/$/, '');
    }

    async VerifyLogin() {
        if (!this.config.auth)
            return ThrowClassNotification(this.info.className, 'VerifyLogin', 'No login credentials provided');
        let response = await axios.post(this.url + '/plugins/httprpc/action.php', null, this.config);

        if (response.status == 200 && response.data == 'false')
            return true;
        return false;
    }
    async GetTorrents(parameters = null) {
        if (!this.info.canGetTorrents) 
            return ThrowClassNotification(this.info.className, 'GetTorrents', 'canGetTorrents is false');
    }
    async AddTorrent(parameters = null) {

    }

    async addTorrentUrl(url) {
        if (!this.info.canAddTorrentUrl) 
            return ThrowClassNotification(this.info.className, 'addTorrentUrl', 'canAddTorrentUrl is false');
    }
    async addTorrentMagnet(magnet) {
        if (!this.info.canAddTorrentMagnet) 
            return ThrowClassNotification(this.info.className, 'addTorrentMagnet', 'canAddTorrentMagnet is false');
    }

    async MakeRequest(url, content, contentType = 'application/x-www-form-urlencoded') {
        const contentTypes = [ 'application/x-www-form-urlencoded', 'multipart/form-data' ];

        if (!this.auth)
            return ThrowClassNotification(this.info.className, 'MakeRequest', 'No login credentials provided')
        try {
            if (contentType == 'application/x-www-form-urlencoded') 
                content = content.toQueryString();
            else if (contentType == 'multipart/form-data')
                content = content.toFormData();
            let response = await axios.post(url, content, { auth: this.auth });

            if (response.status == 401) {       //Unauthorized
                
            }
            else if (response.status == 404) {  //Not Found

            }
        }
        catch (e) {
            ThrowClassNotification(this.info.className, 'MakeRequest', '');
        }
    }
}