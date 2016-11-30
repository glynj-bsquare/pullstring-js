var fs = require('fs');

class TestBase {
    constructor(conversation, request, project) {
        this.conversation = conversation;
        this.request = request;
        this.project = project;
    }

    introduction(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                this.textShouldMatch("Hello. What's your name?", response, t, true);
                this.conversation.sendText('janet');
                break;
            case 1:
                let state = {
                    participantId: this.conversation.getParticipantId()
                };
                this.start(null, state);
                break;
            case 2:
                this.textShouldMatch('Welcome back JANET', response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    introAsr(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                this.textShouldMatch("Hello. What's your name?", response, t, true);
                let file = fs.readFileSync('./res/asrTest.wav');

                if (!file) {
                    t.fail('Unable to open audio file for testing');
                    t.end();
                    return;
                }

                let ab = new ArrayBuffer(file.length);
                let data = new Uint8Array(ab);
                for (let i = 0; i < file.length; i++) {
                    data[i] = file[i];
                }

                let audio = new DataView(ab);

                this.conversation.sendAudio(audio, 1);
                break;
            case 1:
                this.textShouldMatch('Hello Grant', response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    goToResponse(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                let guid = 'd6701507-61a9-47d9-8300-2e9c6b08dfcd';
                this.conversation.goTo(guid);
                break;
            case 1:
                this.textShouldMatch('Hello ', response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    entities(t) {
        let step = 0;
        let label = { name: 'NAME', value: 'jill' };

        this.start(response => {
            switch (step) {
            case 0:
                this.textShouldMatch("Hello. What's your name?", response, t, true);
                this.conversation.sendText('jack');
                break;
            case 1:
                this.conversation.getEntities(['NAME']);
                break;
            case 2:
                this.entityShouldMatch({ name: 'NAME', value: 'jack' }, response, t, true);
                this.conversation.setEntities([label]);
                break;
            case 3:
                this.entityShouldMatch(label, response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    convo(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                this.conversation.sendActivity('wizard');
                break;
            case 1:
                this.conversation.sendText('wizard');
                break;
            case 2:
                this.textShouldMatch('Talk to the dwarf', response, t, true);
                this.conversation.sendText('dwarf');
                break;
            case 3:
                this.textShouldMatch("Here's my axe", response, t, true);
                this.conversation.sendText('dwarf');
                break;
            case 4:
                this.textShouldMatch('You already have my axe', response, t, true);
                this.conversation.sendText('wizard');
                break;
            case 5:
                this.textShouldMatch("Here's my spell", response, t, true);
                this.conversation.sendText('wizard');
                break;
            case 6:
                this.textShouldMatch('You already have my spell', response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    timedResponse(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                this.conversation.sendActivity('fafa5f56-d6f1-4381-aec8-ce37a68e465f');
                break;
            case 1:
                this.textShouldMatch('Say something', response, t, true);
                this.conversation.checkForTimedResponse();
                break;
            case 2:
                if (response.outputs.length) {
                    t.fail('response was returned');
                    t.end();
                }
                this.sleep(response.timedResponseInterval).then(() => {
                    this.conversation.checkForTimedResponse();
                });
                break;
            case 3:
                this.textShouldMatch("I'm waiting", response, t, true);
                this.conversation.sendText('hit the fallback');
                break;
            case 4:
                this.textShouldMatch(['That was something', 'Yes it was'], response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    eventsAndBehaviors(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                this.conversation.sendEvent('simple_event');
                break;
            case 1:
                this.behaviorShouldMatch({ behavior: 'simple_action' }, response, t, true);
                this.conversation.sendEvent('event_with_param', { name: 'green' });
                break;
            case 2:
                let behavior1 = {
                    behavior: 'action_with_param',
                    parameters: { name: 'Green' },
                };
                this.textShouldMatch('Green Event Called', response, t, true);
                this.behaviorShouldMatch(behavior1, response, t, true);
                this.conversation.sendEvent('event_with_param', { name: 'red' });
                break;
            case 3:
                let behavior2 = {
                    behavior: 'action_with_param',
                    parameters: { name: 'Red' },
                };
                this.textShouldMatch('Red Event Called', response, t, true);
                this.behaviorShouldMatch(behavior2, response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    scheduleTimer(t) {
        let step = 0;
        this.start(response => {
            switch (step) {
            case 0:
                this.conversation.sendActivity('timer');
                break;
            case 1:
                this.textShouldMatch('Starting timer', response, t, true);
                this.conversation.sendText('intervening input');
                break;
            case 2:
                this.textShouldMatch('Ignored', response, t, true);
                this.sleep(response.timedResponseInterval).then(() => {
                    this.conversation.checkForTimedResponse();
                });
                break;
            case 3:
                this.textShouldMatch('Timer fired', response, t);
                break;
            default: t.fail();
            }
            step++;
        });
    }

    textShouldMatch(expected, response, t, moreTests) {
        let tests = [];
        if (Array.isArray(expected)) {
            tests = expected;
        } else {
            tests.push(expected);
        }

        for (let i in tests) {
            if (response.outputs[i].text !== tests[i]) {
                t.fail(`Text does not match. expected '${tests[i]}', found '${response.outputs[i].text}'`);
                t.end();
                return;
            }
        }

        if (!moreTests) {
            t.pass();
            t.end();
        }
    }

    entityShouldMatch(expected, response, t, moreTests) {
        let entities = response.entities;
        if (!entities.length) {
            t.fail('Response contains no entities');
        } else if (entities[0].name !== expected.name) {
            t.fail('Entity name did not match');
        } else if (entities[0].value !== expected.value) {
            t.fail('Entity value did not match');
        } else if (!moreTests) {
            t.pass();
        }

        if (!moreTests) {
            t.end();
        }
    }

    behaviorShouldMatch(expected, response, t, moreTests) {
        for (let i in response.outputs) {
            let output = response.outputs[i];
            if (output.type === 'behavior' && output.behavior === expected.behavior) {

                if (expected.parameters) {
                    for (let p in expected.parameters) {
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

    start(callback = null, state = null) {
        this.request.participantId = null;
        this.request.conversationId = null;

        if (state) {
            this.request.participantId = state.participantId;
            this.request.conversationId = state.conversationId;
        }

        if (callback) {
            this.conversation.onResponse = callback;
        }
        this.conversation.start(this.project, this.request);
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
