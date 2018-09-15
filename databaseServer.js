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
var userlist=[];
var i=0;
var myuser;
User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
	myuser=currentUser;
	console.log("Okay");
});

setInterval(function(){
	User.find(function(err,docs){
		console.log(docs);
		for(var i in docs)
		{
			userlist.push(docs[i]["codechefId"]);
		}
	});
},1000*60*60*6);

setInterval(function(){
	if(i<userlist.length)
	{
		var username=userlist[i];
		i++;
		refreshToken.refreshAccessToken(myuser.refreshToken,keys.codechef.username.toLowerCase()).then(function(accessToken){
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
		if(i==userlist.length)
		{
			userlist=[];
		}
	}
	else
	{
		i=0;
	}
},1000*60);


const port = process.env.port || 8090;

app.listen(port, function(){
  console.log("App listening on port " + port);
})