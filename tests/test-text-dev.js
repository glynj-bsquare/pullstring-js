require('babel-core/register');
import test from 'ava';
const XMLHttpRequest = require('xhr2').XMLHttpRequest;
const Conversation = require('../src/Conversation.js').Conversation;
const Request = require('../src/Request.js').Request;
const TestBase = require('./TestBase.js').TestBase;

const API_KEY = '36890c35-8ecd-4ac4-9538-6c75eb1ea6f6';
const PROJECT = '841cbd2c-e1bf-406b-9efe-a9025399aab4';
const BUILD_TYPE = 'production';

var conversation = new Conversation(XMLHttpRequest);
var request = new Request({
    apiKey: API_KEY,
    buildType: BUILD_TYPE,
});

var testBase = new TestBase(conversation, request, PROJECT);

test.cb.serial('introduction', t => {
    testBase.introduction(t);
});

test.cb.serial('intro with asr', t=> {
    testBase.introAsr(t);
});

test.cb.serial('go to response', t => {
    testBase.goToResponse(t);
});

test.cb.serial('entities', t=> {
    testBase.entities(t);
});

test.cb.serial('conversation', t=> {
    testBase.convo(t);
});

test.cb.serial('timed response', t=> {
    testBase.timedResponse(t);
});

test.cb.serial('events and behaviors', t=> {
    testBase.eventsAndBehaviors(t);
});

test.cb.serial('schedule timer', t=> {
    testBase.scheduleTimer(t);
});
