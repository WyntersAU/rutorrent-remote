import axios from 'axios';
import qs from 'qs';

export class ruTorrent {
    constructor(baseUrl, username, password) {
        console.log(baseUrl);
        this.baseUrl = baseUrl;
    }

    async MakeRPCall(relativeUrl, data, contentType = 'application/x-www-form-urlencoded') {
        var options = Object.assign({ 'headers': { 'content-type': contentType }}, this.options);
        var result = null;
        //options.url = "{0}{1}".format(options.baseUrl, relativeUrl);

        try {
            if (contentType == 'multipart/form-data') { //data contains a object
                var form = new FormData();
                form.append(data.name, data.file);

                result = (await axios(options, form)).data;
            }
            else if (contentType == 'application/x-www-form-urlencoded') {
                options.data = qs.stringify(data);
                result = (await axios(options)).data;
            }
            else {
                throw new Error('ContentType "{0}" is not a valid Content-Type for MakeRPCall'.format(contentType), 'rutorrent.js', 26);
            }
        }
        catch (e) {
            console.log(e);
        }

        return result;
    }
}