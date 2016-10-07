var fs = require('fs');

class TestBase {
    constructor(conversation, request,project) {
        this.conversation = conversation;
        this.request = request;
        this.project = project;
    }

    introduction(t) {
        this.start().then((response) => {
            this.textShouldMatch("Hello. What's your name?", response, t, true);
            this.conversation.sendText('janet', this.request, (response) => {
                this.textShouldMatch("Hello Janet", response, t, true);
                let state = this.conversation.getParticipantId();
                this.start(state).then((response) => {
                    this.textShouldMatch('Welcome back JANET', response, t);
                });
            });
        });
    }

    introAsr(t) {
        this.start().then((response) => {
            this.textShouldMatch("Hello. What's your name?", response, t, true);
            let file = fs.readFileSync('./res/asrTest.wav');

            if (!file) {
                t.fail('Unable to open audio file for testing');
                t.end();
                return;
            }

            let ab = new ArrayBuffer(file.length);
            let data =  new Uint8Array(ab);
            for (let i = 0; i < file.length; i++) {
                data[i] = file[i];
            }

            let audio = new DataView(ab);
            this.conversation.sendAudio(audio, 1, this.request, (response) => {
                this.textShouldMatch('Hello Grant', response, t);
            });
        });
    }

    goToResponse(t) {
        this.start().then((response) => {
            let guid = 'd6701507-61a9-47d9-8300-2e9c6b08dfcd';
            this.conversation.goTo(guid, this.request, (response) => {
                this.textShouldMatch("Hello ", response, t);
            });
        });
    }

    entities(t) {
        this.start().then((response) => {
            this.textShouldMatch("Hello. What's your name?", response, t, true);
            this.conversation.sendText('jack', this.request, (response) => {
                this.conversation.getEntities(['NAME'], this.request, (response) => {
                    this.entityShouldMatch({name:'NAME', value:'jack'}, response, t, true);
                    let label = { name: 'NAME', value: 'jill' };
                    this.conversation.setEntities([label], this.request, (response) => {
                        this.entityShouldMatch(label, response, t);
                    });
                });
            });
        });
    }

    convo(t) {
        this.start().then(response => {
            this.conversation.sendActivity('wizard', this.request, (response) => {
                this.conversation.sendText('wizard', this.request, (response) => {
                    this.textShouldMatch('Talk to the dwarf', response, t, true);
                    this.conversation.sendText('dwarf', this.request, (response) => {
                        this.textShouldMatch("Here's my axe", response, t, true);
                        this.conversation.sendText('dwarf', this.request, (response) => {
                            this.textShouldMatch("You already have my axe", response, t, true);
                            this.conversation.sendText('wizard', this.request, (response) => {
                                this.textShouldMatch("Here's my spell", response, t, true);
                                this.conversation.sendText('wizard', this.request, (response) => {
                                    this.textShouldMatch("You already have my spell", response, t);
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    timedResponse(t) {
        this.start().then(reponse => {
            this.conversation.sendActivity('fafa5f56-d6f1-4381-aec8-ce37a68e465f', this.request, (response) => {
                this.textShouldMatch('Say something', response, t, true);
                this.conversation.checkForTimedResponse(this.request, (response) => {
                    if (response.outputs.length) {
                        t.fail('response was returned');
                        t.end();
                    }
                    this.sleep(2.1).then(() => {
                        this.conversation.checkForTimedResponse(this.request, (response) => {
                            this.textShouldMatch("I'm waiting", response, t, true);
                            this.conversation.sendText('hit the fallback', this.request, (response) => {
                                this.textShouldMatch(["That was something", "Yes it was"], response, t);
                            });
                        });
                    });
                });
            });
        });
    }

    eventsAndBehaviors(t) {
        this.start().then(response => {
            this.conversation.sendEvent('simple_event', null, this.request, (response) => {
                this.behaviorShouldMatch({behavior: 'simple_action'}, response, t, true);
                this.conversation.sendEvent('event_with_param', {name: 'green'}, this.request, (response) => {
                    let behavior = {
                        behavior: 'action_with_param',
                        parameters: { name: 'Green' },
                    };
                    this.textShouldMatch('Green Event Called', response, t, true)
                    this.behaviorShouldMatch(behavior, response, t, true);
                    this.conversation.sendEvent('event_with_param', {name: 'red'}, this.request, (response) => {
                        let behavior = {
                            behavior: 'action_with_param',
                            parameters: { name: 'Red' },
                        };
                        this.textShouldMatch('Red Event Called', response, t, true)
                        this.behaviorShouldMatch(behavior, response, t);
                    });
                });
            });
        });
    }

    scheduleTimer(t) {
        this.start().then(response => {
            this.conversation.sendActivity('timer', this.request, (response) => {
                this.textShouldMatch('Starting timer', response, t, true);
                this.conversation.sendText('intervening input', this.request, (response) => {
                    this.textShouldMatch('Ignored', response, t, true);
                    this.sleep(2.1).then(() => {
                        this.conversation.checkForTimedResponse(this.request, (response) =>{
                            this.textShouldMatch('Timer fired',response, t);
                        });
                    });
                });
            });
        });
    }

    textShouldMatch(expected, response, t, moreTests) {
        let tests = [];
        if (Array.isArray(expected)) {
            tests = expected;
        } else {
            tests.push(expected);
        }

        for (var i in tests) {
            if (response.outputs[i].text !== tests[i]) {
                t.fail(`Text does not match. expected '${tests[i]}', found '${response.outputs[i].text}'`);
                t.end();
                return;
            }
        }

        if(!moreTests) {
            t.pass();
            t.end();
        }
    }

    entityShouldMatch(expected, response, t, moreTests) {
        let entities = response.entities;
        if (!entities.length) {
            t.fail("Response contains no entities");
        } else if (entities[0].name !== expected.name) {
            t.fail("Entity name did not match")
        } else if (entities[0].value !== expected.value) {
            t.fail("Entity value did not match")
        } else if (!moreTests){
            t.pass();
        }

        if (!moreTests) {
            t.end();
        }
    }

    behaviorShouldMatch(expected, response, t, moreTests) {
        for (var i in response.outputs) {
            let output = response.outputs[i];
            if (output.type === 'behavior' && output.behavior === expected.behavior) {

                if (expected.parameters) {
                    for (var p in expected.parameters) {
                        if (!output.parameters.hasOwnProperty(p) || output.parameters[p] !== expected.parameters[p]) {
                            t.fail('behavior parameters did not match');
                            t.end();
                            return;
                        }
                    }
                }

                if (!moreTests) {
                    t.pass();
                    t.end();
                }
                return;
            }
        }

        t.fail('matching behavior not found');
        t.end();
    }

    start(state = null) {
        state ? this.request.participantId = state : this.request.participantId = null;
        return new Promise((resolve) => {
            this.conversation.start(this.project, this.request, (response) => {
                this.request.conversationId = response.conversationId;
                resolve(response);
            });
        });
    }

    sleep(time) {
        return new Promise((resolve) => {
            if (!time) {
                resolve();
            } else {
                setTimeout(resolve, time * 1000.0);
            }
        });
    }
}

module.exports = { TestBase };
