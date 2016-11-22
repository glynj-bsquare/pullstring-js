/*
 * Encapsulate a request to the PullString Web API.
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */

/**
 * The asset build tyoe to request for Web API requests
 * @readonly
 * @enum {string}
 * @property {string} EBuildType.Sandbox
 * @property {string} EBuildType.Staging
 * @property {string} EBuildType.Production
 */
const EBuildType = {
    Sandbox: 'sandbox',
    Staging: 'staging',
    Production: 'production',
};

/**
 * @readonly
 * @enum {Number}
 * @property {Number} EAudioFormat.RawPcm16k
 * @property {Number} EAudioFormat.Wav16k
 */
const EAudioFormat = {
    RawPcm16k: 0,
    Wav16k: 1,
};

/**
 * Describe the parameters for a request to the PullString Web API.
 * @property {string} apiKey Your API key, required for all requests.
 * @property {string} participantId Identifies state to the Web API and can
 * persist across sessions.
 * @property {EBuildType} buildType defaults to EBuildType.Production.
 * @property {string} conversationId Identifies an ongoing conversation to the
 * Web API and can persist across sessions. It is required after a conversation
 * is started.
 * @property {string} language ASR language; defaults to 'en-US'.
 * @property {string} locale User locale; defaults to'en-US'.
 * @property {boolean} restartIfModified Restart this conversation if a newer
 * version of the project has been published. Default value is true.
 * @property {number} timeZoneOffset A value in seconds representing the offset
 * in UTC. For example, PST would be -28800.
 * @property {string} accountId
 */
class Request {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.participantId = config.participant;
        this.buildType = config.buildType || EBuildType.Production;
        this.conversationId = config.conversationId;
        this.language = config.language || 'en-US';
        this.locale = config.locale;
        this.accountId = config.accountId;
        this.timeZoneOffset = config.timeZoneOffset || 0;
        this.restartIfModified = config.restartIfModified || true;
    }
}

Request.EBuildType = EBuildType;
Request.EAudioFormat = EAudioFormat;

module.exports = { Request };
