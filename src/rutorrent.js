import axios from 'axios'
import qs from 'qs'
import {ToBytes, ToSpeed} from 'utilities.js'

export class Torrent {
	constructor(hash, rutorrent) {
		this.hash = hash;
		this.rutorrent = rutorrent;
	}

	start() {
		this.rutorrent.sendRPCRequest({
			mode: 'start',
			hash: this.hash
		});
	}

	stop() {
		this.rutorrent.sendRPCRequest({
			mode: 'stop',
			hash: this.hash
		})
	}
	recheck() {

	}
	delete() {

	}

	getState() {

	}
	getFiles() {
		this.rutorrent.sendRPCRequest({
			mode: 'fls',
			hash: this.hash
		})
	}

	getName = () => {
		return this.name || '?';
	}
	getStatus = () => {
		return this.status || '?';
	}
	getSize = () => {
		return ToBytes(this.size) || '?';
	}
	getDone = () => {
		return +(this.downloaded / this.size * 100).toFixed(2) + '%' || '?';
	}
	getDownloaded = () => {
		return ToBytes(+this.downloaded) || '?';
	}
	getUploaded = () => {
		return ToBytes(+this.uploaded) || '?';
	}
	getRatio = () => {
		return +(this.ratio / 1000).toFixed(3) || 0;
	}
	getDl = () => {
		return ToSpeed(+this.dl) || '?';
	}
	getUl = () => {
		return ToSpeed(+this.ul) || '?';
	}
	getArray = () => {
		return [
			this.getName(),
			this.getStatus(),
			this.getSize(),
			this.getDone(),
			this.getDownloaded(),
			this.getUploaded(),
			this.getRatio(),
			this.getDl(),
			this.getUl()
		];
	}


	setPriority(priority) {

	}
};

export class ruTorrent {
	constructor(url, username, password) {
		this.url = url;
		this.auth = { username: username, password: password };
		this.cid = 0;
		this.torrents = new Array();

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
	  		torrent.size = info[5];
	  		torrent.downloaded = info[8];
	  		torrent.uploaded = info[9];
	  		torrent.ratio = info[10];
	  		torrent.ul = info[11];
	  		torrent.dl = info[12];
			torrent.added = info[34];

			this.torrents.push(torrent);
		}

		this.cid = list_torrents.cid;
		return this.torrents;
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

