/*
 * Make REST calls to PullString's Web API.
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */

class RestClient {
    constructor(options) {
        this.decode = options.decode || JSON.parse;
        this.encode = options.encode || JSON.stringify;
        this.baseUrl = options.baseUrl;
        this.XMLHttpRequest = options.xhr || XMLHttpRequest;
    }

    get(endpoint, params, headers, callback) {
        if (!this.baseUrl) return;
        let fullUrl = this._url(endpoint, params);
        this._sendRequest(fullUrl, 'GET', headers, callback);
    }

    post(endpoint, params, headers, body, callback, doEncode = true) {
        if (!this.baseUrl) return;
        let url = this._url(endpoint, params);
        if (doEncode && this.encode) {
            body = this.encode(body);
        }
        this._sendRequest(url, 'POST', headers, callback, body);
    }

    put(endpoint, params, headers, body, callback, doEncode = true) {
        if (!this.baseUrl) return;
        let url = this._url(endpoint, params);
        if (doEncode && this.encode) {
            body = this.encode(body);
        }
        this._sendRequest(url, 'POST', headers, callback, body);
    }

    delete(endpoint, params, headers, callback) {
        if (!this.baseUrl) return;
        let url = this._url(endpoint, params);
        this._sendRequest(url, 'DELETE', headers, callback);
    }

    _url(endpoint, params) {
        let url = this.baseUrl;
        if (!url.endsWith('/')) {
            url = `${url}/`;
        }

        let query = [];
        for (let p in params) {
            if (params.hasOwnProperty(p)) {
                let key = encodeURIComponent(p);
                let val = encodeURIComponent(params[p]);
                let param = `${key}=${val}`;
                query.push(param);
            }
        };
        return `${url}${endpoint}?${query.join('&')}`;
    }

    _sendRequest(url, method, headers, callback, body = null) {
        let xhr = new this.XMLHttpRequest();
        xhr.open(method, url, true);

        for (let h in headers) {
            if (headers.hasOwnProperty(h)) {
                xhr.setRequestHeader(h, headers[h]);
            }
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                let response = {};
                let status = {};
                status.code = xhr.status;
                status.success = xhr.status < 400;
                if (status.success) {
                    response = xhr.responseText;
                    if (this.decode) {
                        response = this.decode(response);
                    }
                } else {
                    status.message = xhr.responseText;
                }

                response.status = status;
                callback && callback(response);
            }
        };

        xhr.send(body);
    }
}

module.exports = { RestClient };
