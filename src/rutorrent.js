import axios from 'axios'
import qs from 'qs'
import {Torrent} from 'torrent'

export class ruTorrent {
	constructor(url, username, password) {
		this.url = url;
		this.auth = { username: username, password: password };
		this.cid = 0;

		//TODO: Create error-notification.
		if (!this.exists())
			throw new Error('ruTorrent does not exist at ' + url);
	}

	/*Returns *true* or *false* whether ruTorrent exists at _this.url_*/
	async exists() {
		var options = ruTorrent.GetRequestOptions(this.url + "/js/rtorrent.js", this.auth.username, this.auth.password);

		if ((await axios(options)).status != 200)
			return false;
		return true;
	}

	/*Returns a dictionary-object of torrent-hashes with their respective data in each object*/
	async getTorrents() {
		var list_torrents = (await this.sendRPCRequest({ 'mode': 'list', 'cmd': 'd.custom=seedingtime' }));

		if (this.cid == list_torrents.cid)
			return this.torrents;

		for (var hash in list_torrents.t) {
			var info = list_torrents.t[hash];
			var torrent = new Torrent(hash, this);
			
			torrent.name = info[4];
	  		var size = info[5];
	  		var downloaded = info[8];
	  		var uploaded = info[9];
	  		var ratio = info[10];
	  		var ul = info[11];
	  		var dl = info[12];
			var added = info[34];


		}
	}

	/*Any RPC-related *connections* are done through _sendRPCRequest_*/
	async sendRPCRequest(parameters) {
		var options = ruTorrent.GetRequestOptions(this.url+'/plugins/httprpc/action.php', this.auth.username, this.auth.password, 'rpc');
		options['data'] = qs.stringify(parameters);
		return (await axios(options)).data;
	}

	/*Ensure *all* connections through _axios_ are done through _GetRequestOptions_*/
	static GetRequestOptions(url, username, password, method) {
		var options = {
		  	'url': url,
		  	'method': 'post',
		    'auth': {
		    	'username': username,
		    	'password': password
		    }
		};

		if (method == 'rpc') {
			options['method'] = 'post';
			options['headers'] = { 'content-type': 'application/x-www-form-urlencoded' };
		}
		else if (method == null) {
			options['method'] = 'get';
		}
		else {
			options['method'] = method;
		}

		return options;
	}
}