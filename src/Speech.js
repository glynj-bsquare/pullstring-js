/*
 * Control collection and processing of audio data for ASR.
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */

import SpeechWorker from './SpeechWorker.js';

class Speech {
    constructor() {
        this._callback = null;
        this._worker = null;
    }

    start() {
        this._worker = new Worker(this._getSpeechWorkerUrl());
        this._worker.onmessage = (message) => {
            this._callback && this._callback(message);
        };
    }

    add(audio) {
        let workerObj = {
            command: 'listen',
            buffer: audio,
        };
        this._worker.postMessage(workerObj, [workerObj.buffer.buffer]);
    }

    flush() {
        this._worker.postMessage({
            command: 'flush',
        });
    }

    getBytes(cb) {
        if (!cb) {
            throw new Error('Callback must be provide to process audio');
        }

        this._callback = (message) => {
            cb && cb(message.data);
        };
        this._worker.postMessage({
            command: 'getMono',
        });
    }

    _getSpeechWorkerUrl() {
        let createObjURL = (window.URL && URL.createObjectURL.bind(URL)) ||
            (window.webkitURL && window.webkitURL.createObjectURL.bind(window.webkitURL)) ||
            window.createObjectURL;

        if (!createObjURL) {
            createObjURL = global.createObjectURL;
        }

        let funcStr = SpeechWorker.toString();
        let bodyStart = funcStr.indexOf('{');
        let bodyEnd = funcStr.lastIndexOf('}');

        if (bodyStart > 0 && bodyEnd > bodyStart) {
            let speechWorkerFunc = funcStr.substring(bodyStart + 1, bodyEnd);
            return createObjURL(new Blob([speechWorkerFunc]), {type: 'text/javascript'});
        }

        return null;
    }
}

module.exports = { Speech: Speech };
