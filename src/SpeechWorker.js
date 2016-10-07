/*
 * Aggregate audio data and prepare for sending to the PullString Web API.
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */

function SpeechWorker() {
    let recLength = 0;
    let recBuffers = [];
    let messages = {};
    let _this = this;

    this.onmessage = (message) => {
        let command = message.data.command;
        messages[command] && messages[command](message.data);
    };

    function listen(data) {
        recBuffers.push(data.buffer);
        recLength += data.buffer.length;
    }

    function flush(data) {
        recLength = 0;
        recBuffers = [];
    }

    function concatenate(buffers, len) {
        let merged = new Float32Array(len);
        let offset = 0;
        for (let i = 0; i < buffers.length; i++) {
            merged.set(buffers[i], offset);
            offset += buffers[i].length;
        }
        return merged;
    }

    function getMono(data) {
        let monoBuffer = concatenate(recBuffers, recLength);
        let bufferLength = monoBuffer.length * 2;
        let arrayBuffer = new ArrayBuffer(bufferLength);
        let dataView = new DataView(arrayBuffer);

        // convert raw samples to bytes
        let byteOffset = 0;
        for (let i = 0; i < monoBuffer.length; i++) {
            let inSample = monoBuffer[i];
            let sample = Math.max(-1, Math.min(1, inSample));
            let intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            dataView.setUint16(byteOffset, intSample, true);
            byteOffset += 2;
        }

        _this.postMessage(dataView);
    }

    messages = {
        listen: listen,
        flush: flush,
        getMono: getMono,
    };
}

module.exports = SpeechWorker;
