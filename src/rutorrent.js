import axios from 'axios'
import qs from 'qs'
import {Torrent} from 'torrent'

export class ruTorrent {
	constructor(url, username, password) {
		this.url = url;
		this.auth = { username: username, password: password };

		//TODO: Create error-notification.
		if (!this.exists())
			throw new Error('ruTorrent does not exist at ' + url);
	}
	/*
		Returns *true* or *false* whether ruTorrent exists at _this.url_
	*/
	async exists() {
		var options = ruTorrent.GetRequestOptions(this.url + "/js/rtorrent.js", this.auth.username, this.auth.password);

		if ((await axios(options)).status != 200)
			return false;
		return true;
	}
	//TODO: Create 'httpRPCExists'

	async getTorrents() {
		return (await this.sendRPCRequest({ 'mode': 'list' }));
	}

	/*
		Any RPC-related *connections* are done through _sendRPCRequest_
	*/
	async sendRPCRequest(parameters) {
		var options = ruTorrent.GetRequestOptions(this.url+'/plugins/httprpc/action.php', this.auth.username, this.auth.password, 'rpc');
		options['data'] = qs.stringify(parameters);
		return (await axios(options)).data;
	}

	/*
		Ensure *all* connections through _axios_ are done through _GetRequestOptions_
	*/
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