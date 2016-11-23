# PullStringSDK Class Reference

The PullString Web API lets you add text or audio conversational capabilities to your apps, based upon content that you write in the PullString Author environment and publish to the PullString Platform.

## Modules

Name|Description
----|-----------
[``pullstring``](#module_pullstring)| Main PullString SDK module.

## Classes

Name|Description
----|-----------
[`Conversation`](#Conversation)|The Conversation class can be used to interface with the PullString API.
[`Request`](#Request)|Describe the parameters for a request to the PullString Web API.
[`Phoneme`](#Phoneme)|Describe a single phoneme for an audio response, e.g., to drive automatic lip sync.
[`Entity`](#Entity)|Base class to describe a single entity, such as a label, counter, flag, or list.
[`Label`](#Label)|Subclass of Entity to describe a single Label
[`Counter`](#Counter) (extends [`Entity`](#Entity))|Subclass of Entity to describe a single Counter
[`Flag`](#Flag) (extends [`Entity`](#Entity )|Subclass of Entity to describe a single Flag
[`List`](#List) (extends [`Entity`](#Entity )|Subclass of Entity to describe a single List
[`Output`](#Output)|Base class for outputs that are of type dialog or behavior
[`DialogOutput`](#DialogOutput) (extends [`Output`](#Output )|Subclass of Output that represents a dialog response
[`BehaviorOutput`](#BehaviorOutput) (extends [`Output`](#Output )|Subclass of Output that represents a behavior response
[`Status`](#Status)|Describe the status and any errors from a Web API response
[`Response`](#Response)|Describe a single response from the PullString Web API
[`VersionInfo`](#VersionInfo)|Encapsulates version information for PullString&#39;s&#39; Web API.

## Enums

Name|Description
----|-----------
 [`EBuildType`](#EBuildType)|The asset build tyoe to request for Web API requests
 [`EAudioFormat`](#EAudioFormat)|
 [`EOutputType`](#EOutputType)|Define the set of outputs that can be returned in a response.
 [`EEntityType`](#EEntityType)|Define the list of entity types
 [`EFeatures`](#EFeatures)|Define features to check if they are supported.

<a name="module_pullstring"></a>

## pullstring Module
Main PullString SDK module.

<a name="Conversation"></a>

## Conversation
The Conversation class can be used to interface with the PullString API.

To begin a conversation, call the `start()` method, providing a PullString
project ID and a Request object specifying you API key.

The Web API returns a Response object that can contain zero or more outputs,
such as lines of dialog or behaviors. This Response object is passed to the
onResponse callback as its sole parameter.

**Kind**: global class

**Properties**

| Name | Type | Description
| --- | --- | ---
| onResponse | `function` | Callback to receive responses from the Web API.


* [Conversation](#Conversation)
    * [new Conversation([nodeXhr])](#new_Conversation_new)
    * [.start(projectName, request)](#Conversation+start)
    * [.sendText(text, [request])](#Conversation+sendText)
    * [.sendActivity(activity, [request])](#Conversation+sendActivity)
    * [.sendEvent(event, parameters, [request])](#Conversation+sendEvent)
    * [.startAudio([request])](#Conversation+startAudio)
    * [.addAudio(buffer)](#Conversation+addAudio)
    * [.stopAudio()](#Conversation+stopAudio)
    * [.sendAudio(audio, format, [request])](#Conversation+sendAudio)
    * [.goTo(responseId, [request])](#Conversation+goTo)
    * [.checkForTimedResponse([request])](#Conversation+checkForTimedResponse)
    * [.getEntities(entities, [request])](#Conversation+getEntities)
    * [.setEntities(entities, [request])](#Conversation+setEntities)
    * [.getConversationId()](#Conversation+getConversationId) ⇒ `string`
    * [.getParticipantId()](#Conversation+getParticipantId) ⇒ `string`
    * [~onResponse](#Conversation..onResponse) : `function`

<a name="new_Conversation_new"></a>

### new Conversation([nodeXhr])
Creates a Conversation


| Param | Type | Description | Required
| --- | --- | --- | --- |
| [nodeXhr] | `XMLHttpReqeuest` | If in Node.js, pass in the XMLHttpReqeuest module class. | No

<a name="Conversation+start"></a>

### conversation.start(projectName, request)
Start a new conversation with the Web API and receive a reponse via the
onResponse callback.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| projectName | `string` | The PullString project ID. | Yes
| request | [`Request`](#Request) | A Request object with a valid apiKey (`request.apiKey`) value specified. The object will be stored internally and used for future requests | Yes

<a name="Conversation+sendText"></a>

### conversation.sendText(text, [request])
Send user input text to the Web API and receive a response via the
onResponse callback.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| text | `string` | User input text. | Yes |
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+sendActivity"></a>

### conversation.sendActivity(activity, [request])
Send an activity name or ID to the Web API and receive a response via
the onResponse callback.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| activity | `string` | The activity name or ID. | Yes |
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+sendEvent"></a>

### conversation.sendEvent(event, parameters, [request])
Send an event to the Web API and receive a response via the onResponse
callback.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| event | `string` | The event name. | Yes
| parameters | `Object` | Any accompanying parameters. | Yes
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+startAudio"></a>

### conversation.startAudio([request])
Initiate a progressive (chunked) streaming of audio data, where supported.

Note, chunked streaming is not currently implemented, so this will batch
up all audio and send it all at once when end_audio() is called.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+addAudio"></a>

### conversation.addAudio(buffer)
Add a chunk of audio. You must call start_audio() first. The format of
the audio must be mono LinearPCM audio data at a sample rate of 16000
samples per second.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| buffer | `Float32Array` | The audio data, i.e. from `audioBuffer.getChannelData(0)`. | Yes

<a name="Conversation+stopAudio"></a>

### conversation.stopAudio()
Signal that all audio has been provided via add_audio() calls. This will
complete the audio request and return the Web API response.

**Kind**: instance method of [`Conversation`](#Conversation)
<a name="Conversation+sendAudio"></a>

### conversation.sendAudio(audio, format, [request])
Send an entire audio sample of the user speaking to the Web API. Audio
must be raw, mono 16-bit linear PCM at a sample rate of 16000
samples per second.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| audio | `DataView` | Mono 16-bit linear PCM audio data at 16k Hz. | Yes
| format | `Request.EAudioFormat` | Specify WAV or raw PCM format. Note that only 16-bit linear PCM WAV format at 16k is currently supported. | Yes
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+goTo"></a>

### conversation.goTo(responseId, [request])
Jump the conversation directly to a response.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| responseId | `string` | The UUID of the response to jump to. | Yes
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+checkForTimedResponse"></a>

### conversation.checkForTimedResponse([request])
Call the Web API to see if there is a time-based response to process. You
only need to call this if the previous response returned a value for the
timedResponseInterval >= 0.  In this case, set a timer for that value (in
seconds) and then call this method. If there is no time-based response,
the onResponse callback will be passed an empty Response object.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+getEntities"></a>

### conversation.getEntities(entities, [request])
Request the values of the specified entities (i.e.: labels, counters, flags,
and lists) from the Web API.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| entities | `Array.<string>` | An array of entity names. | Yes
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+setEntities"></a>

### conversation.setEntities(entities, [request])
Change the value of the specified entities (i.e.: labels, counters, flags,
and lists) via the Web API.

**Kind**: instance method of [`Conversation`](#Conversation)

| Param | Type | Description | Required
| --- | --- | --- | --- |
| entities | `Array.<Object>` | An array specifying the entities to set and their new values. Values are require for `entity.name` and `entity.value` for all objects in the array | Yes
| [request] | [`Request`](#Request) | A request object with at least apiKey (`request.apiKey`) and conversationId (`request.conversationId`) set. | No |

<a name="Conversation+getConversationId"></a>

### conversation.getConversationId() ⇒ `string`
Retrieve the current conversation ID. Conversation IDs can persist across
sessions, if desired.

**Kind**: instance method of [`Conversation`](#Conversation)
**Returns**: `string` - The current conversation ID.
<a name="Conversation+getParticipantId"></a>

### conversation.getParticipantId() ⇒ `string`
Get the current participant ID, which identifies the current state for
clients. This can persist across sessions, if desired.

**Kind**: instance method of [`Conversation`](#Conversation)
**Returns**: `string` - The current participant ID.
<a name="Conversation..onResponse"></a>

### Conversation~onResponse : `function`
**Kind**: inner typedef of [`Conversation`](#Conversation)
<a name="Request"></a>

## Request
Describe the parameters for a request to the PullString Web API.

**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| apiKey | `string` | Your API key, required for all requests. |
| participantId | `string` | Identifies state to the Web API and can persist across sessions. |
| buildType | [`EBuildType`](#EBuildType) | defaults to EBuildType.Production. |
| conversationId | `string` | Identifies an ongoing conversation to the Web API and can persist across sessions. It is required after a conversation is started. |
| language | `string` | ASR language; defaults to 'en-US'. |
| locale | `string` | User locale; defaults to'en-US'. |
| restartIfModified | `boolean` | Restart this conversation if a newer version of the project has been published. Default value is true. |
| timeZoneOffset | `number` | A value in seconds representing the offset in UTC. For example, PST would be -28800. |
| accountId | `string` |  |

<a name="Phoneme"></a>

## Phoneme
Describe a single phoneme for an audio response, e.g., to drive automatic
lip sync.

**Kind**: global class
**Properties**

| Name | Type |
| --- | --- |
| name | `string` |
| secondsSinceStart | `number` |

<a name="Entity"></a>

## Entity
Base class to describe a single entity, such as a label, counter, flag, or list

**Kind**: global class
**Properties**

| Name | Type |
| --- | --- |
| name | `string` |

<a name="Label"></a>

## Label ⇐ [`Entity`](#Entity)
Subclass of Entity to describe a single Label

**Kind**: global class
**Extends:** [`Entity`](#Entity)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [`EEntityType`](#EEntityType) | EEntityType.Label (read only) |
| value | `string` |  |

<a name="Counter"></a>

## Counter ⇐ [`Entity`](#Entity)
Subclass of Entity to describe a single Counter

**Kind**: global class
**Extends:** [`Entity`](#Entity)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [`EEntityType`](#EEntityType) | EEntityType.Counter (read only) |
| value | `number` |  |

<a name="Flag"></a>

## Flag ⇐ [`Entity`](#Entity)
Subclass of Entity to describe a single Flag

**Kind**: global class
**Extends:** [`Entity`](#Entity)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [`EEntityType`](#EEntityType) | EEntityType.Flag (read only) |
| value | `boolean` |  |

<a name="List"></a>

## List ⇐ [`Entity`](#Entity)
Subclass of Entity to describe a single List

**Kind**: global class
**Extends:** [`Entity`](#Entity)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [`EEntityType`](#EEntityType) | EEntityType.List (read only) |
| value | `Array` |  |

<a name="Output"></a>

## Output
Base class for outputs that are of type dialog or behavior

**Kind**: global class
**Properties**

| Name | Type |
| --- | --- |
| guid | `string` |

<a name="DialogOutput"></a>

## DialogOutput ⇐ [`Output`](#Output)
Subclass of Output that represents a dialog response

**Kind**: global class
**Extends:** [`Output`](#Output)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [`EOutputType`](#EOutputType) | EOutputType.DialogResponse (read only) |
| text | `string` | A character's text response. |
| uri | `string` | Location of recorded audio, if available. |
| videoFile | `string` | Location of recorded video, if available. |
| duration | `number` | Duration of spoken line in seconds. |
| character | `string` | The speaking character. |
| phonemes | `Array<`[`Phoneme`](#Phoneme)`>` | Array of phonemes for driving automatic lip sync. |

<a name="BehaviorOutput"></a>

## BehaviorOutput ⇐ [`Output`](#Output)
Subclass of Output that represents a behavior response

**Kind**: global class
**Extends:** [`Output`](#Output)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | [`EOutputType`](#EOutputType) | EOutputType.BehaviorResponse (read only) |
| behavior | `string` | The name of the behavior. |
| parameters | `Object` | An object with any parameters defined for the behavior. |

<a name="Status"></a>

## Status
Describe the status and any errors from a Web API response

**Kind**: global class
**Properties**

| Name | Type |
| --- | --- |
| code | `number` |
| message | `string` |
| success | `boolean` |

<a name="Response"></a>

## Response
Describe a single response from the PullString Web API

**Kind**: global class
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | [`Status`](#Status) |  |
| outputs | `Array.<`[`Output`](#Output)`>` | Dialog or behaviors returned from the Web API |
| entities | `Array.<`[`Entity`](#Entity)`>` | Counters, flags, etc for the converation |
| lastModified | `Date` |  |
| conversationId | `string` | Identifies an ongoing conversation to the Web API and can persist across sessions. It is required after a conversation is started. |
| participantId | `string` | Identifies state to the Web API and can persist across sessions. |
| etag | `string` | Unique identifier of a version of the content. |
| timedResponseInterval | `number` | Indicates that there may be another response to process in the specified number of seconds. Set a timer and call checkForTimedResponse() from a conversation to retrieve it. |
| asrHypothesis | `string` | The recognized speech, if audio has been submitted. |
| Response.EOutputType | [`EOutputType`](#EOutputType) |  |
| Response.EEntityType | [`EEntityType`](#EEntityType) |  |

<a name="VersionInfo"></a>

## VersionInfo
Encapsulates version information for PullString's' Web API.

**Kind**: global class
<a name="VersionInfo.hasFeature"></a>

### VersionInfo.hasFeature(feature)
Check if the endpoint currently supports a feature.

**Kind**: static method of [`VersionInfo`](#VersionInfo)

| Param | Type | Description |
| --- | --- | --- |
| feature | [`EFeatures`](#EFeatures) | The feature to check. |

<a name="EBuildType"></a>

## EBuildType : `enum`
The asset build tyoe to request for Web API requests

**Kind**: global constant
**Read only**: true
**Properties**

| Name | Type | Value |
| --- | --- | --- |
| Sandbox | `string` | `"sandbox"` |
| Staging | `string` | `"staging"` |
| Production | `string` | `"production"` |

<a name="EAudioFormat"></a>

## EAudioFormat : `enum`
**Kind**: global constant
**Read only**: true
**Properties**

| Name | Type | Value |
| --- | --- | --- |
| RawPcm16k | `Number` | `0` |
| Wav16k | `Number` | `1` |

<a name="EOutputType"></a>

## EOutputType
Define the set of outputs that can be returned in a response.

**Kind**: global constant
**Read only**: true
**Properties**

| Name | Type | Value |
| --- | --- | --- |
| EOutputType.DialogResponse | `string` | `"dialog"`
| EOutputType.BehaviorResponse | `string` | `"behavior"`

<a name="EEntityType"></a>

## EEntityType
Define the list of entity types

**Kind**: global constant
**Read only**: true
**Properties**

| Name | Type | Value |
| --- | --- | --- |
| EEntityType.Label | `string` | `"labal"` |
| EEntityType.Counter | `string` | `"counter"` |
| EEntityType.Flag | `string` | `"flag"` |
| EEntityType.List | `string` | `"list"` |

<a name="EFeatures"></a>

## EFeatures
Define features to check if they are supported.

**Kind**: global constant
**Read only**: true
**Properties**

| Name | Type | Value |
| --- | --- | --- |
| EFeatures.StreamingAsr | `int` | 0 |

