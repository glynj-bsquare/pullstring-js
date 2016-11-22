## Modules

<dl>
<dt><a href="#module_pullstring">pullstring</a></dt>
<dd><p>Main PullString SDK module.</p>
</dd>
</dl>

## Classes

<dl>
<dt><a href="#Conversation">Conversation</a></dt>
<dd><p>The Conversation class can be used to interface with the PullString API.</p>
<p>To begin a conversation, call the start() method, providing a PullString
project ID and a Request object specifying you API key.</p>
<p>The Web API returns a Response object that can contain zero or more outputs,
such as lines of dialog or behaviors. This Response object is passed to the
onResponse callback as its sole parameter.</p>
</dd>
<dt><a href="#Request">Request</a></dt>
<dd><p>Describe the parameters for a request to the PullString Web API.</p>
</dd>
<dt><a href="#Phoneme">Phoneme</a></dt>
<dd><p>Describe a single phoneme for an audio response, e.g., to drive automatic
lip sync.</p>
</dd>
<dt><a href="#Entity">Entity</a></dt>
<dd><p>Base class to describe a single entity, such as a label, counter, flag, or list</p>
</dd>
<dt><a href="#Label">Label</a> ⇐ <code><a href="#Entity">Entity</a></code></dt>
<dd><p>Subclass of Entity to describe a single Label</p>
</dd>
<dt><a href="#Counter">Counter</a> ⇐ <code><a href="#Entity">Entity</a></code></dt>
<dd><p>Subclass of Entity to describe a single Counter</p>
</dd>
<dt><a href="#Flag">Flag</a> ⇐ <code><a href="#Entity">Entity</a></code></dt>
<dd><p>Subclass of Entity to describe a single Flag</p>
</dd>
<dt><a href="#List">List</a> ⇐ <code><a href="#Entity">Entity</a></code></dt>
<dd><p>Subclass of Entity to describe a single List</p>
</dd>
<dt><a href="#Output">Output</a></dt>
<dd><p>Base class for outputs that are of type dialog or behavior</p>
</dd>
<dt><a href="#DialogOutput">DialogOutput</a> ⇐ <code><a href="#Output">Output</a></code></dt>
<dd><p>Subclass of Output that represents a dialog response</p>
</dd>
<dt><a href="#BehaviorOutput">BehaviorOutput</a> ⇐ <code><a href="#Output">Output</a></code></dt>
<dd><p>Subclass of Output that represents a behavior response</p>
</dd>
<dt><a href="#Status">Status</a></dt>
<dd><p>Describe the status and any errors from a Web API response</p>
</dd>
<dt><a href="#Response">Response</a></dt>
<dd><p>Describe a single response from the PullString Web API</p>
</dd>
<dt><a href="#VersionInfo">VersionInfo</a></dt>
<dd><p>Encapsulates version information for PullString&#39;s&#39; Web API.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#EBuildType">EBuildType</a> : <code>enum</code></dt>
<dd><p>The asset build tyoe to request for Web API requests</p>
</dd>
<dt><a href="#EAudioFormat">EAudioFormat</a> : <code>enum</code></dt>
<dd></dd>
<dt><a href="#EOutputType">EOutputType</a></dt>
<dd><p>Define the set of outputs that can be returned in a response.</p>
</dd>
<dt><a href="#EEntityType">EEntityType</a></dt>
<dd><p>Define the list of entity types</p>
</dd>
<dt><a href="#EFeatures">EFeatures</a></dt>
<dd><p>Define features to check if they are supported.</p>
</dd>
</dl>

<a name="module_pullstring"></a>

## pullstring
Main PullString SDK module.

**Properties**

| Name | Type |
| --- | --- |
| Conversation | <code>[Conversation](#Conversation)</code> | 
| Response | <code>[Response](#Response)</code> | 
| Status | <code>[Status](#Status)</code> | 
| DialogOutput | <code>[DialogOutput](#DialogOutput)</code> | 
| BehaviorOutput | <code>[BehaviorOutput](#BehaviorOutput)</code> | 
| Label | <code>[Label](#Label)</code> | 
| Counter | <code>[Counter](#Counter)</code> | 
| Flag | <code>[Flag](#Flag)</code> | 
| List | <code>[List](#List)</code> | 
| Phoneme | <code>[Phoneme](#Phoneme)</code> | 
| Request | <code>[Request](#Request)</code> | 
| VersionInfo | <code>[VersionInfo](#VersionInfo)</code> | 

<a name="Conversation"></a>

## Conversation
The Conversation class can be used to interface with the PullString API.

To begin a conversation, call the start() method, providing a PullString
project ID and a Request object specifying you API key.

The Web API returns a Response object that can contain zero or more outputs,
such as lines of dialog or behaviors. This Response object is passed to the
onResponse callback as its sole parameter.

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| ApiBaseUrl | <code>string</code> | 
| AsrSampleRate | <code>Number</code> | 
| AsrChannels | <code>Number</code> | 


* [Conversation](#Conversation)
    * [new Conversation([nodeXhr])](#new_Conversation_new)
    * _instance_
        * [.start(projectName, request)](#Conversation+start)
        * [.sendText(text, request)](#Conversation+sendText)
        * [.sendActivity(activity, request)](#Conversation+sendActivity)
        * [.sendEvent(event, parameters, request)](#Conversation+sendEvent)
        * [.startAudio(request)](#Conversation+startAudio)
        * [.addAudio(buffer)](#Conversation+addAudio)
        * [.stopAudio()](#Conversation+stopAudio)
        * [.sendAudio(audio, format, request)](#Conversation+sendAudio)
        * [.goTo(responseId, request)](#Conversation+goTo)
        * [.checkForTimedResponse(request)](#Conversation+checkForTimedResponse)
        * [.getEntities(entities, request)](#Conversation+getEntities)
        * [.setEntities(entities, request)](#Conversation+setEntities)
        * [.getConversationId()](#Conversation+getConversationId) ⇒ <code>string</code>
        * [.getParticipantId()](#Conversation+getParticipantId) ⇒ <code>string</code>
    * _inner_
        * [~onResponse](#Conversation..onResponse) : <code>function</code>

<a name="new_Conversation_new"></a>

### new Conversation([nodeXhr])
Creates a Conversation


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [nodeXhr] | <code>XMLHttpReqeuest</code> | <code></code> | If in Node.js, pass in the XMLHttpReqeuest module class. |

<a name="Conversation+start"></a>

### conversation.start(projectName, request)
Start a new conversation with the Web API and receive a reponse via the
onResponse callback.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| projectName | <code>string</code> | The PullString project ID. |
| request | <code>[Request](#Request)</code> | A Request object with a valid apiKey value specified. |
| request.apiKey | <code>string</code> | Your API key. |

<a name="Conversation+sendText"></a>

### conversation.sendText(text, request)
Send user input text to the Web API and receive a response via the
onResponse callback.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>string</code> | User input text. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |
| request.apiKey | <code>string</code> | Your API key. |
| request.conversationId | <code>string</code> | The conversation ID received when the conversation was started. |

<a name="Conversation+sendActivity"></a>

### conversation.sendActivity(activity, request)
Send an activity name or ID to the Web API and receive a response via
the onResponse callback.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| activity | <code>string</code> | The activity name or ID. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+sendEvent"></a>

### conversation.sendEvent(event, parameters, request)
Send an event to the Web API and receive a response via the onResponse
callback.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>string</code> | The event name. |
| parameters | <code>Object</code> | Any accompanying parameters. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+startAudio"></a>

### conversation.startAudio(request)
Initiate a progressive (chunked) streaming of audio data, where supported.

Note, chunked streaming is not currently implemented, so this will batch
up all audio and send it all at once when end_audio() is called.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+addAudio"></a>

### conversation.addAudio(buffer)
Add a chunk of audio. You must call start_audio() first. The format of
the audio must be mono LinearPCM audio data at a sample rate of 16000
samples per second.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>Float32Array</code> | The audio data, i.e. from `audioBuffer.getChannelData(0)`. |

<a name="Conversation+stopAudio"></a>

### conversation.stopAudio()
Signal that all audio has been provided via add_audio() calls. This will
complete the audio request and return the Web API response.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  
<a name="Conversation+sendAudio"></a>

### conversation.sendAudio(audio, format, request)
Send an entire audio sample of the user speaking to the Web API. Audio
must be raw, mono 16-bit linear PCM at a sample rate of 16000
samples per second.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| audio | <code>DataView</code> | Mono 16-bit linear PCM audio data at 16k Hz. |
| format | <code>Request.EAudioFormat</code> | Specify WAV or raw PCM format. Note that only 16-bit linear PCM WAV format at 16k is currently supported. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+goTo"></a>

### conversation.goTo(responseId, request)
Jump the conversation directly to a response.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| responseId | <code>string</code> | The UUID of the response to jump to. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+checkForTimedResponse"></a>

### conversation.checkForTimedResponse(request)
Call the Web API to see if there is a time-based response to process. You
only need to call this if the previous response returned a value for the
timedResponseInterval >= 0.  In this case, set a timer for that value (in
seconds) and then call this method. If there is no time-based response,
the onResponse callback will be passed an empty Response object.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+getEntities"></a>

### conversation.getEntities(entities, request)
Request the values of the specified entities (i.e.: labels, counters, flags,
and lists) from the Web API.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| entities | <code>Array.&lt;string&gt;</code> | An array of entity names. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+setEntities"></a>

### conversation.setEntities(entities, request)
Change the value of the specified entities (i.e.: labels, counters, flags,
and lists) via the Web API.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  

| Param | Type | Description |
| --- | --- | --- |
| entities | <code>Array.&lt;Object&gt;</code> | An array specifying the entities to set and their new values. |
| entities[].name | <code>string</code> | The entity's name. |
| entities[].value | <code>\*</code> | The entity's name, which can be any type. |
| request | <code>[Request](#Request)</code> | A request object with at least apiKey and conversationId set. |

<a name="Conversation+getConversationId"></a>

### conversation.getConversationId() ⇒ <code>string</code>
Retrieve the current conversation ID. Conversation IDs can persist across
sessions, if desired.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  
**Returns**: <code>string</code> - The concurrent conversation ID.  
<a name="Conversation+getParticipantId"></a>

### conversation.getParticipantId() ⇒ <code>string</code>
Get the current participant ID, which identifies the current state for
clients. This can persist across sessions, if desired.

**Kind**: instance method of <code>[Conversation](#Conversation)</code>  
**Returns**: <code>string</code> - The current participant ID.  
<a name="Conversation..onResponse"></a>

### Conversation~onResponse : <code>function</code>
**Kind**: inner typedef of <code>[Conversation](#Conversation)</code>  
<a name="Request"></a>

## Request
Describe the parameters for a request to the PullString Web API.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| apiKey | <code>string</code> | Your API key, required for all requests. |
| participantId | <code>string</code> | Identifies state to the Web API and can persist across sessions. |
| buildType | <code>[EBuildType](#EBuildType)</code> | defaults to EBuildType.Production. |
| conversationId | <code>string</code> | Identifies an ongoing conversation to the Web API and can persist across sessions. It is required after a conversation is started. |
| language | <code>string</code> | ASR language; defaults to 'en-US'. |
| locale | <code>string</code> | User locale; defaults to'en-US'. |
| restartIfModified | <code>boolean</code> | Restart this conversation if a newer version of the project has been published. Default value is true. |
| timeZoneOffset | <code>number</code> | A value in seconds representing the offset in UTC. For example, PST would be -28800. |
| accountId | <code>string</code> |  |

<a name="Phoneme"></a>

## Phoneme
Describe a single phoneme for an audio response, e.g., to drive automatic
lip sync.

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 
| secondsSinceStart | <code>number</code> | 

<a name="Entity"></a>

## Entity
Base class to describe a single entity, such as a label, counter, flag, or list

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="Label"></a>

## Label ⇐ <code>[Entity](#Entity)</code>
Subclass of Entity to describe a single Label

**Kind**: global class  
**Extends:** <code>[Entity](#Entity)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>[EEntityType](#EEntityType)</code> | EEntityType.Label (read only) |
| value | <code>string</code> |  |

<a name="Counter"></a>

## Counter ⇐ <code>[Entity](#Entity)</code>
Subclass of Entity to describe a single Counter

**Kind**: global class  
**Extends:** <code>[Entity](#Entity)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>[EEntityType](#EEntityType)</code> | EEntityType.Counter (read only) |
| value | <code>number</code> |  |

<a name="Flag"></a>

## Flag ⇐ <code>[Entity](#Entity)</code>
Subclass of Entity to describe a single Flag

**Kind**: global class  
**Extends:** <code>[Entity](#Entity)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>[EEntityType](#EEntityType)</code> | EEntityType.Flag (read only) |
| value | <code>boolean</code> |  |

<a name="List"></a>

## List ⇐ <code>[Entity](#Entity)</code>
Subclass of Entity to describe a single List

**Kind**: global class  
**Extends:** <code>[Entity](#Entity)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>[EEntityType](#EEntityType)</code> | EEntityType.List (read only) |
| value | <code>Array</code> |  |

<a name="Output"></a>

## Output
Base class for outputs that are of type dialog or behavior

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| guid | <code>string</code> | 

<a name="DialogOutput"></a>

## DialogOutput ⇐ <code>[Output](#Output)</code>
Subclass of Output that represents a dialog response

**Kind**: global class  
**Extends:** <code>[Output](#Output)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>[EOutputType](#EOutputType)</code> | EOutputType.DialogResponse (read only) |
| text | <code>string</code> | A character's text response. |
| uri | <code>string</code> | Location of recorded audio, if available. |
| videoFile | <code>string</code> | Location of recorded video, if available. |
| duration | <code>number</code> | Duration of spoken line in seconds. |
| character | <code>string</code> | The speaking character. |
| phonemes | <code>[Array.&lt;Phoneme&gt;](#Phoneme)</code> | Array of phonemes for driving automatic lip sync. |

<a name="BehaviorOutput"></a>

## BehaviorOutput ⇐ <code>[Output](#Output)</code>
Subclass of Output that represents a behavior response

**Kind**: global class  
**Extends:** <code>[Output](#Output)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>[EOutputType](#EOutputType)</code> | EOutputType.BehaviorResponse (read only) |
| behavior | <code>string</code> | The name of the behavior. |
| parameters | <code>Object</code> | An object with any parameters defined for the behavior. |

<a name="Status"></a>

## Status
Describe the status and any errors from a Web API response

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| code | <code>number</code> | 
| message | <code>string</code> | 
| success | <code>boolean</code> | 

<a name="Response"></a>

## Response
Describe a single response from the PullString Web API

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>[Status](#Status)</code> |  |
| outputs | <code>[Array.&lt;Output&gt;](#Output)</code> | Dialog or behaviors returned from the Web API |
| entities | <code>[Array.&lt;Entity&gt;](#Entity)</code> | Counters, flags, etc for the converation |
| lastModified | <code>Date</code> |  |
| conversationId | <code>string</code> | Identifies an ongoing conversation to the Web API and can persist across sessions. It is required after a conversation is started. |
| participantId | <code>string</code> | Identifies state to the Web API and can persist across sessions. |
| etag | <code>string</code> | Unique identifier of a version of the content. |
| timedResponseInterval | <code>number</code> | Indicates that there may be another response to process in the specified number of seconds. Set a timer and call checkForTimedResponse() from a conversation to retrieve it. |
| asrHypothesis | <code>string</code> | The recognized speech, if audio has been submitted. |
| Response.EOutputType | <code>[EOutputType](#EOutputType)</code> |  |
| Response.EEntityType | <code>[EEntityType](#EEntityType)</code> |  |

<a name="VersionInfo"></a>

## VersionInfo
Encapsulates version information for PullString's' Web API.

**Kind**: global class  
<a name="VersionInfo.hasFeature"></a>

### VersionInfo.hasFeature(feature)
Check if the endpoint currently supports a feature.

**Kind**: static method of <code>[VersionInfo](#VersionInfo)</code>  

| Param | Type | Description |
| --- | --- | --- |
| feature | <code>[EFeatures](#EFeatures)</code> | The feature to check. |

<a name="EBuildType"></a>

## EBuildType : <code>enum</code>
The asset build tyoe to request for Web API requests

**Kind**: global constant  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| EBuildType.Sandbox | <code>string</code> |  | 
| EBuildType.Staging | <code>string</code> |  | 
| EBuildType.Production | <code>string</code> |  | 
| Sandbox | <code>string</code> | <code>&quot;sandbox&quot;</code> | 
| Staging | <code>string</code> | <code>&quot;staging&quot;</code> | 
| Production | <code>string</code> | <code>&quot;production&quot;</code> | 

<a name="EAudioFormat"></a>

## EAudioFormat : <code>enum</code>
**Kind**: global constant  
**Read only**: true  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| EAudioFormat.RawPcm16k | <code>Number</code> |  | 
| EAudioFormat.Wav16k | <code>Number</code> |  | 
| RawPcm16k | <code>Number</code> | <code>0</code> | 
| Wav16k | <code>Number</code> | <code>1</code> | 

<a name="EOutputType"></a>

## EOutputType
Define the set of outputs that can be returned in a response.

**Kind**: global constant  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| EOutputType.DialogResponse | <code>string</code> | 
| EOutputType.BehaviorResponse | <code>string</code> | 

<a name="EEntityType"></a>

## EEntityType
Define the list of entity types

**Kind**: global constant  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| EEntityType.Label | <code>string</code> | 
| EEntityType.Counter | <code>string</code> | 
| EEntityType.Flag | <code>string</code> | 
| EEntityType.List | <code>string</code> | 

<a name="EFeatures"></a>

## EFeatures
Define features to check if they are supported.

**Kind**: global constant  
**Read only**: true  
**Properties**

| Name | Type |
| --- | --- |
| EFeatures.StreamingAsr | <code>int</code> | 

