(function() {
    function SpeechListener(conversation) {
        var _this = this;

        this.outSampleRate = PS.Conversation.AsrSampleRate;
        this.channels = PS.Conversation.AsrChannels;
        this.conversation = conversation;
        this.isRecording = false;
        this.request = null;
        this.audioContext = null;
        this.mediaStreamSource = null;
        this.node = null;

        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            window.OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log("error initializing audio: " + JSON.stringify(e));
        }


        this.processAudio = function(audio) {
            if (!_this.isRecording) return;
            var mono = audio.inputBuffer.getChannelData(0);
            var ratio = _this.audioContext.sampleRate / _this.outSampleRate;
            var dsCount = mono.length / ratio;
            var offline = new OfflineAudioContext(_this.channels, dsCount, _this.outSampleRate);
            var bufferSource = offline.createBufferSource();

            // downsample audio to 16 kHz in background and then pass result
            // to converation.addAudio()
            bufferSource.buffer = audio.inputBuffer;
            bufferSource.connect(offline.destination);
            bufferSource.start();
            offline.startRendering();
            offline.oncomplete = function(e) {
                var buffer = e.renderedBuffer.getChannelData(0);
                _this.conversation.addAudio(buffer);
            }
        };

        this.init = function(callback) {
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio: true}, _onAudioStart, function(e) {
                    callback && callback(false);
                });
            } else {
                callback && callback(false);
            }

            function _onAudioStart(stream) {
                _this.mediaStreamSource = _this.audioContext.createMediaStreamSource(stream);
                _this.node = _this.audioContext.createScriptProcessor(0, _this.channels, _this.channels);
                _this.node.onaudioprocess = _this.processAudio;
                _this.mediaStreamSource.connect(_this.node);
                _this.node.connect(_this.audioContext.destination);

                callback && callback(true);
            }
        };

        this.startAudio = function(request) {
            this.isRecording = true
            this.conversation.startAudio(request);
        };

        this.stopAudio = function(callback) {
            this.isRecording = false;
            this.conversation.stopAudio(callback);
        };
    }

    window.SpeechListener = SpeechListener;
})();
