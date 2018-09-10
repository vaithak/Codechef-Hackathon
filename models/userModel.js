const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    refreshToken: String,
    codechefId:   String,
    thumbnail:    String,
    accessTokenTimeStamp: Number,
    accessToken: String,
    notes:        {type : Array , "default" : []}
});

const User = mongoose.model('user', userSchema);

module.exports = User;
