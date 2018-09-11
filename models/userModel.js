const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    refreshToken:         String,
    codechefId:  	  String,
    thumbnail:    	  String,
    accessTokenTimeStamp: Number,
    accessToken: 	  String,
    notes:        	  {type : Array , "default" : []},
    email:        	  {type : String, "default" : ""},
    reminder:     	  {type : Boolean, "default" :false}
});

const User = mongoose.model('user', userSchema);

module.exports = User;
