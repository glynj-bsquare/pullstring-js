/*
 * The PullString Javascript SDK
 *
 * Copyright (c) 2016 PullString, Inc.
 *
 * The following source code is licensed under the MIT license.
 * See the LICENSE file, or https://opensource.org/licenses/MIT.
 */
import {Conversation} from './Conversation.js';
import {Response, Status, DialogOutput, BehaviorOutput, Label, Counter, Flag, List, Phoneme} from './Response.js';
import {Request} from './Request.js';

/**
 * Main PullString SDK module.
 * @module pullstring
 * @property {Conversation} Conversation
 * @property {Response} Response
 * @property {Status} Status
 * @property {DialogOutput} DialogOutput
 * @property {BehaviorOutput} BehaviorOutput
 * @property {Label} Label
 * @property {Counter} Counter
 * @property {Flag} Flag
 * @property {List} List
 * @property {Phoneme} Phoneme
 * @property {Request} Request
 */

module.exports = {
    Conversation: Conversation,
    Response: Response,
    Status: Status,
    DialogOutput: DialogOutput,
    BehaviorOutput: BehaviorOutput,
    Label: Label,
    Counter: Counter,
    Flag: Flag,
    List: List,
    Phoneme: Phoneme,
    Request: Request,
};
