const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailListSchema = new Schema({
    Id:   String
});

const MailList = mongoose.model('MailList', MailListSchema);

module.exports = MailList;
