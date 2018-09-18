const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({
    school: {type : Object, "default" : {}},
    easy: {type : Object, "default" : {}},
    medium: {type : Object, "default" : {}},
    hard: {type : Object, "default" : {}},
    challenge: {type : Object, "default" : {}},
    extcontest: {type : Object, "default" : {}}
});

const questions = mongoose.model('Questions', QuestionsSchema);

module.exports = questions;
