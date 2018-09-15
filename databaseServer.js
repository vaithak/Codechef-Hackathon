const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const User=require('./models/userModel');
const refreshToken = require('./config/refreshToken2');
const request = require('request-promise');

const app = express()

mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true }, function() {
    console.log('connected to mongodb');
});

setInterval(function(){
	User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
	User.find(function(err,docs){
		var i=0;
		console.log(docs);
		setInterval(function(){
			if(i<docs.length)
			{
				var username=docs[i]["codechefId"];
				i++;
			    refreshToken.refreshAccessToken(currentUser.refreshToken,keys.codechef.username.toLowerCase()).then(function(accessToken){
				    var options = {
				      method: 'GET',
				      uri: 'https://api.codechef.com/users/'+username,
				      headers: {
				         'Accept': 'application/json',
				         'Authorization': 'Bearer ' + accessToken
				      },
				      json: true // Automatically parses the JSON string in the response
				    };
				    request(options)
				    .then(function(result){
				    	var rankings=result['result']['data']['content']['rankings'];
				    	var ratings=result['result']['data']['content']['ratings'];
				    	var institute=result['result']['data']['content']['organization'];
				    	User.findOneAndUpdate({'codechefId':username},{$set:{rating:ratings,ranking:rankings,institute:institute}}, function(err, doc){
				    		console.log("Updated "+username);
				    	});;
				    });	    	
			    });
			}
		},1000*10);
	});
	});
},1000*60*2);
const port = process.env.port || 8090;

app.listen(port, function(){
  console.log("App listening on port " + port);
})