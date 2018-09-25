const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    refreshToken:          String,
    fullname:              String,
    codechefId:  	         String,
    thumbnail:    	       String,
    accessTokenTimeStamp:  Number,
    accessToken: 	         String,
    band:                  String,
    institute:             {type : String, "default" : ""},
    rating: 			         {type : Object, "default" : {}},
    ranking: 			         {type : Object, "default" : {}},
    notes:        	       {type : Array , "default" : []},
    email:        	       {type : String, "default" : ""},
    lastRecommended:       {type : Object, "default" : {}},
    reminder:     	       {type : Boolean,"default" : false},
    following:             {type : Array,  "default" : []},
    questionLevel: 			   {type:  Number, "default" : 0},
    practiseLevel: 			   {type:  Array, "default"  : [0]},
    savedArticles:         {type:  Array, "default"  : []},
    likedArticles:         {type:  Array, "default"  : []},
    dislikedArticles:      {type:  Array, "default"  : []}
});

const User = mongoose.model('user', userSchema);

module.exports = User;
