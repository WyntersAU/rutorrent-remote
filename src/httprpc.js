import axios from 'axios'
import qs from 'qs'

export class httprpc {
	constructor(url, username, password) {
		this.url = url;
		this.auth = { username: username, password: password };
    	this.parameters = new URLSearchParams();
	}
	addParameter(name, value) {
		this.parameters.append(name, value);
	}
	async send() {
		var options = {
		  url: this.url,
	      method: 'post',
	      headers: { 'content-type': 'application/x-www-form-urlencoded' },
	      data: qs.stringify(this.parameters),
	      auth: this.auth	
		}

		return (await axios(options)).data; 
	}
}