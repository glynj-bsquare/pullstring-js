/*
 * Encapsulate a response from the PullString Web API.
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */

/**
 * Define the set of outputs that can be returned in a response.
 * @readonly
 * @property {string} EOutputType.DialogResponse
 * @property {string} EOutputType.BehaviorResponse
 */
const EOutputType = {
    DialogResponse: 'dialog',
    BehaviorResponse: 'behavior',
};

/**
 * Define the list of entity types
 * @readonly
 * @property {string} EEntityType.Label
 * @property {string} EEntityType.Counter
 * @property {string} EEntityType.Flag
 * @property {string} EEntityType.List
 */
const EEntityType = {
    Label: 'label',
    Counter: 'counter',
    Flag: 'flag',
    List: 'list'
};

/**
 * Describe a single phoneme for an audio response, e.g., to drive automatic
 * lip sync.
 * @property {string} name
 * @property {number} secondsSinceStart
 */
class Phoneme {
    constructor(config) {
        this.name = config.name ? String(config.name) : null;
        this.secondsSinceStart = +config.seconds_since_start;
    }
}

/**
 * Base class to describe a single entity, such as a label, counter, flag, or list
 * @property {string} name
 */
class Entity {
    constructor(name) {
        this.name = name ? String(name) : null;
    }
}

/**
 * Subclass of Entity to describe a single Label
 * @extends Entity
 * @property {EEntityType} type EEntityType.Label (read only)
 * @property {string} value
 */
class Label extends Entity {
    constructor(name, value) {
        super(name);
        this.type = EEntityType.Label;
        this.value = value ? String(value) : null;
    }
}

/**
 * Subclass of Entity to describe a single Counter
 * @extends Entity
 * @property {EEntityType} type EEntityType.Counter (read only)
 * @property {number} value
 */
class Counter extends Entity {
    constructor(name, value) {
        super(name);
        this.type = EEntityType.Counter;
        this.value = +value;
    }
}

/**
 * Subclass of Entity to describe a single Flag
 * @extends Entity
 * @property {EEntityType} type EEntityType.Flag (read only)
 * @property {boolean} value
 */
class Flag extends Entity {
    constructor(name, value) {
        super(name);
        this.type = EEntityType.Flag;
        this.value = !!value;
    }
}

/**
 * Subclass of Entity to describe a single List
 * @extends Entity
 * @property {EEntityType} type EEntityType.List (read only)
 * @property {Array} value
 */
class List extends Entity {
    constructor(name, value) {
        super(name);
        this.type = EEntityType.List;
        this.value = Array.isArray(value) ? value.slice() : [];
    }
}

/**
 * Base class for outputs that are of type dialog or behavior
 * @property {string} guid
 */
class Output {
    constructor(guid) {
        this.guid = String(guid);
    }
}

/**
 * Subclass of Output that represents a dialog response
 * @extends Output
 * @property {EOutputType} type EOutputType.DialogResponse (read only)
 * @property {string} text A character's text response.
 * @property {string} uri Location of recorded audio, if available.
 * @property {string} videoFile Location of recorded video, if available.
 * @property {number} duration Duration of spoken line in seconds.
 * @property {string} character The speaking character.
 * @property {Phoneme[]} phonemes Array of phonemes for driving automatic lip sync.
 */
class DialogOutput extends Output {
    constructor(config) {
        super(config.id);
        this.type = EOutputType.DialogResponse;
        this.text = config.text ? String(config.text) : null;
        this.uri = config.uri ? String(config.uri) : null;
        this.videoFile = config.video_file ? String(config.video_file) : null;
        this.duration = config.duration ? +config.duration : 0;
        this.character = config.character ? String(config.character) : null;
        this.phonemes = [];
        for (let index in config.phonemes) {
            let p = config.phonemes[index];
            let phoneme = new Phoneme(p);
            this.phonemes.push(phoneme);
        }
    }
}

/**
 * Subclass of Output that represents a behavior response
 * @extends Output
 * @property {EOutputType} type EOutputType.BehaviorResponse (read only)
 * @property {string} behavior The name of the behavior.
 * @property {Object} parameters An object with any parameters defined for the
 * behavior.
 */
class BehaviorOutput extends Output {
    constructor(config) {
        super(config.id);
        this.type = EOutputType.BehaviorResponse;
        this.behavior = config.behavior ? String(config.behavior) : null;
        this.parameters = {};
        for (let key in config.parameters) {
            this.parameters[key] = config.parameters[key];
        }
    }
}

/**
 * Describe the status and any errors from a Web API response
 * @property {number} code
 * @property {string} message
 * @property {boolean} success
 * */
class Status {
    constructor(status) {
        this.code = +status.code;
        this.message = status.message ? String(status.message) : null;
        this.success = !!status.success;
    }
}

/**
 * Describe a single response from the PullString Web API
 * @property {Status} status
 * @property {Output[]} outputs Dialog or behaviors returned from the Web API
 * @property {Entity[]} entities Counters, flags, etc for the converation
 * @property {Date} lastModified
 * @property {string} conversationId Identifies an ongoing conversation to the
 * Web API and can persist across sessions. It is required after a conversation
 * is started.
 * @property {string} participantId Identifies state to the Web API and can
 * persist across sessions.
 * @property {number} timedResponseInterval Indicates that there may be another
 * response to process in the specified number of seconds. Set a timer and call
 * checkForTimedResponse() from a conversation to retrieve it.
 * @property {string} asrHypothesis The recognized speech, if audio has been
 * submitted.
 * @property {EOutputType} Response.EOutputType
 * @property {EEntityType} Response.EEntityType
 */
class Response {
    constructor(json) {
        this.status = new Status(json.status);
        this.outputs = [];

        for (let index in json.outputs) {
            let output = json.outputs[index];
            if (output.type === EOutputType.DialogResponse) {
                let dialog = new DialogOutput(output);
                this.outputs.push(dialog);
            } else if (output.type === EOutputType.BehaviorResponse) {
                let behavior = new BehaviorOutput(output);
                this.outputs.push(behavior);
            }

        }

        this.entities = [];
        let entities = json.entities;

        for (let name in entities) {
            if (!entities.hasOwnProperty(name)) continue;
            let value = entities[name];
            let type = typeof value;

            if (type === 'boolean') {
                let flag = new Flag(name, value);
                this.entities.push(flag);
            } else if (type === 'number') {
                let counter = new Counter(name, value);
                this.entities.push(counter);
            } else if (type === 'string') {
                let label = new Label(name, value);
                this.entities.push(label);
            } else if (type === 'object' && Array.isArray(value)) {
                let list = new List(name, value);
                this.entities.push(list);
            }
        }

        this.lastModified = json.last_modified ? new Date(json.last_modified) : null;
        this.conversationId = json.conversation ? String(json.conversation) : null;
        this.participantId = json.participant ? String(json.participant) : null;
        this.timedResponseInterval = json.timed_response_interval ? +json.timed_response_interval : -1;
        this.asrHypothesis = json.asr_hypothesis ? String(json.asr_hypothesis) : null;
    }
}

Response.EEntityType = EEntityType;
Response.EOutputType = EOutputType;

module.exports = {
    Response: Response,
    Status: Status,
    DialogOutput: DialogOutput,
    BehaviorOutput: BehaviorOutput,
    Label: Label,
    Counter: Counter,
    Flag: Flag,
    List: List,
    Phoneme: Phoneme,
};
