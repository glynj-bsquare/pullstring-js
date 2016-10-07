/*
 * Encapsulate a conversation thread for PullString's Web API.
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */

import {Response, Status} from './Response.js';
import {RestClient} from './RestClient.js';
import {Request} from './Request.js';
import {Speech} from './Speech.js';

/**
 * The Conversation class can be used to interface with the PullString API.
 *
 * To begin a conversation, call the start() method, providing a PullString
 * project ID and a Request object specifying you API key.
 *
 * The Web API returns a Response object that can contain zero or more outputs,
 * such as lines of dialog or behaviors. This Response object is passed to the
 * callback as its sole parameter.
 *
 * @property {string} ApiBaseUrl
 * @property {Number} AsrSampleRate
 * @property {Number} AsrChannels
 */
class Conversation {
    /**
     * Creates a Conversation
     * @param {XMLHttpReqeuest} [nodeXhr = null] If in Node.js, pass in the
     * XMLHttpReqeuest module class.
     */
    constructor(nodeXhr = null) {
        let config = { baseUrl: Conversation.ApiBaseUrl };
        if (nodeXhr) config.xhr = nodeXhr;
        this._client = new RestClient(config);
        this._speech = new Speech();
        this._audioRequest = null;
    }

    /**
     * Start a new conversation with the Web API and receive a reponse via the
     * callback.
     * @param {string} projectName The PullString project ID.
     * @param {Request} request A Request object with a valid apiKey value
     * specified.
     * @param {string} request.apiKey Your API key.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    start(projectName, request, callback) {
        let json = {
            project: projectName,
            time_zone_offset: request.timeZoneOffset, // eslint-disable-line camelcase
        };

        request.conversationId = null;
        this._post(json, request, callback);
    }

    /**
     * Send user input text to the Web API and receive a response via the callback.
     * @param {string} text User input text.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {string} request.apiKey Your API key.
     * @param {string} request.conversationId The conversation ID received when
     * the conversation was started.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    sendText(text, request, callback) {
        let json = {
            text: text,
        };

        this._post(json, request, callback);
    }

    /**
     * Send an activity name or ID to the Web API and receive a response via
     * the callback.
     * @param {string} activity The activity name or ID.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    sendActivity(activity, request, callback) {
        let json = {
            activity: activity,
        };

        this._post(json, request, callback);
    }

    /**
     * Send an event to the Web API and receive a response via the callback.
     * @param {string} event The event name.
     * @param {Object} parameters Any accompanying parameters.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    sendEvent(event, parameters, request, callback) {
        let eventObj = {
            name: event,
            parameters: parameters || {},
        };

        let json = {
            event: eventObj,
        };

        this._post(json, request, callback);
    }

    /**
     * Initiate a progressive (chunked) streaming of audio data, where supported.
     *
     * Note, chunked streaming is not currently implemented, so this will batch
     * up all audio and send it all at once when end_audio() is called.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     */
    startAudio(request) {
        this._speech.start();
        this._audioRequest = request;
    }

    /**
     * Add a chunk of audio. You must call start_audio() first. The format of
     * the audio must be mono LinearPCM audio data at a sample rate of 16000
     * samples per second.
     * @param {Float32Array} buffer The audio data, i.e. from
     * `audioBuffer.getChannelData(0)`.
     */
    addAudio(buffer) {
        this._speech.add(buffer);
    }

    /**
     * Signal that all audio has been provided via add_audio() calls. This will
     * complete the audio request and return the Web API response.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    stopAudio(callback) {
        let _this = this;
        this._speech.getBytes((data) => {
            _this._speech.flush();
            _this._postAudio(
                data,
                _this._audioRequest,
                callback
            );
        });
    }

    /**
     * Send an entire audio sample of the user speaking to the Web API. Audio
     * must be raw, mono 16-bit linear PCM at a sample rate of 16000
     * samples per second.
     * @param {DataView} audio Mono 16-bit linear PCM audio data at 16k Hz.
     * @param {Request.EAudioFormat} format Specify WAV or raw PCM format. Note
     * that only 16-bit linear PCM WAV format at 16k is currently supported.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     * */
    sendAudio(audio, format, request, callback) {
        if (Object.prototype.toString.call(audio) !== '[object DataView]') {
            this._returnError('Audio sent to sendAudio is not a DataView', callback);
            return;
        }

        if (format !== Request.EAudioFormat.Wav16k) {
            this._returnError('Unsupported format sent to sendAudio.', callback);
            return;
        }

        let audioData = this._getWavData(audio);

        if (audioData.error) {
            this._returnError(audioData.error);
            return;
        }

        this._postAudio(audioData, request, callback);
    }

    /**
     * Jump the conversation directly to a response.
     * @param {string} responseId The UUID of the response to jump to.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    goTo(responseId, request, callback) {
        let json = {
            goto: responseId,
        };

        this._post(json, request, callback);
    }

    /**
     * Call the Web API to see if there is a time-based response to process. You
     * only need to call this if the previous response returned a value for the
     * timedResponseInterval >= 0.  In this case, set a timer for that value (in
     * seconds) and then call this method. If there is no time-based response,
     * the callback will pass an empty Response object.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    checkForTimedResponse(request, callback) {
        let json = {/* empty json */};
        this._post(json, request, callback);
    }

    /**
     * Request the values of the specified entities (i.e.: labels, counters, flags,
     * and lists) from the Web API.
     * @param {string[]} entities An array of entity names.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    getEntities(entities, request, callback) {
        if (!Array.isArray(entities)) {
            this._returnError('entities sent to getEntities must be an array', callback);
            return;
        }

        let json = {
            get_entities: entities, // eslint-disable-line camelcase
        };

        this._post(json, request, callback);
    }

    /**
     * Change the value of the specified entities (i.e.: labels, counters, flags,
     * and lists) via the Web API.
     * @param {Object[]} entities An array specifying the entities to set and
     * their new values.
     * @param {string} entities[].name The entity's name.
     * @param {*} entities[].value The entity's name, which can be any type.
     * @param {Request} request A request object with at least apiKey and
     * conversationId set.
     * @param {function} callback A function to receive the Web API's response.
     * It should have a single parameter that will be passed a Response object.
     */
    setEntities(entities, request, callback) {
        if (!Array.isArray(entities)) {
            this._returnError('entities sent to setEntities must be an array', callback);
            return;
        }

        let entObj = {};
        for (let i in entities) {
            let entity = entities[i];
            entObj[entity.name] = entity.value;
        }

        let json = {
            set_entities: entObj, // eslint-disable-line camelcase
        };

        this._post(json, request, callback);
    }

    /**
     * Retrieve the current conversation ID. Conversation IDs can persist across
     * sessions, if desired.
     * @return {string} The concurrent conversation ID.
     */
    getConversationId() {
        if (this._lastResponse.conversationId) {
            return this._lastResponse.conversationId;
        }

        return null;
    }

    /**
     * Get the current participant ID, which identifies the current state for
     * clients. This can persist across sessions, if desired.
     * @return {string} The current participant ID.
     */
    getParticipantId() {
        if (this._lastResponse.participantId) {
            return this._lastResponse.participantId;
        }

        return null;
    }

    _post(body, request, callback, contentType = 'application/json', doEncode = true) {
        let endpoint = this._endpointForRequest(request);
        let headers = this._headersForRequest(request, contentType);
        let params = this._paramsForRequest(request);

        this._client.post(
            endpoint,
            params,
            headers,
            body,
            (response) => this._responseHandler(response, callback),
            doEncode
        );
    }

    _postAudio(audio, request, callback) {
        if (!audio) {
            this._returnError('Unable to extract audio data', callback);
            return;
        }

        this._post(audio, request, callback, 'audio/l16; rate=16000', false);
    }

    _headersForRequest(request, contentType) {
        let headers = {
            Authorization: `Bearer ${request.apiKey}`,
            Accept: 'application/json',
        };

        headers['Content-Type'] = contentType;

        return headers;
    }

    _paramsForRequest(request) {
        let params = {
            build_type: request.buildType, // eslint-disable-line camelcase
            asr_language: request.language, // eslint-disable-line camelcase
            locale: request.locale,
        };

        if (request.acountId) params.account = request.accountId;
        if (request.participantId) params.participant = request.participantId;

        return params;
    }

    _endpointForRequest(request) {
        let endpoint = 'conversation';

        if (request.conversationId) {
            endpoint = `${endpoint}/${request.conversationId}`;
        }

        return endpoint;
    }

    _responseHandler(json, callback) {
        let response = new Response(json);
        if (response.status.success) {
            this._lastResponse = response;
        };

        callback && callback(response);
    }

    _getWavData(dataView) {
        let riff = this._dataViewGetString(dataView, 0, 4);

        if (riff !== 'RIFF') {
            return { error: 'Data is not a WAV file' };
        }

        let channels = dataView.getUint16(22, true);
        let rate = dataView.getUint32(24, true);
        let bitsPerSample = dataView.getUint16(34, true);

        if (channels !== 1 || rate !== 16000 || bitsPerSample !== 16) {
            return { error: 'WAV data is not mono 16-bit data at 16k sample rate' };
        }

        let dataOffset = 12;
        let chunkSize = dataView.getUint32(16, true);
        let fileSize = dataView.getUint32(4, true);

        while (this._dataViewGetString(dataView, dataOffset, 4) !== 'data') {
            if (dataOffset > fileSize) {
                return { error: 'Cannot find data segment in WAV file' };
            }

            dataOffset += chunkSize + 8;
            chunkSize = dataView.getUint32(dataOffset + 4, true);
        }

        let dataStart = dataOffset + 8;
        return dataView.buffer.slice(dataStart);
    }

    _dataViewGetString(dataView, offset, length) {
        let retVal = '';
        for (let i = 0; i < length; i++) {
            let charCode = dataView.getUint8(i + offset);
            retVal = retVal + String.fromCharCode(charCode);
        }

        return retVal;
    }

    _returnError(message, callback) {
        let error = new Status({
            success: false,
            message: message,
        });

        callback && callback({
            status: error,
        });
    }
}

// static constants
Object.defineProperty(Conversation, 'ApiBaseUrl', {
    value: 'https://conversation.pullstring.ai/v1/',
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Conversation, 'AsrSampleRate', {
    value: 16000,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Conversation, 'AsrChannels', {
    value: 1,
    writable: false,
    enumerable: true,
    configurable: false,
});

module.exports = { Conversation };
