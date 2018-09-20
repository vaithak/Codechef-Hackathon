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

User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
	var myUser=currentUser;
	console.log("Okay");
  start(myUser['refreshToken']);
});

function start(myUserRefreshToken){
  setInterval(function(){
    var userlist=[];
    User.find(function(err,docs){
      // console.log(docs);
      for(var i=0; i<docs.length; i++)
      {
        userlist.push(docs[i]["codechefId"]);
      }

      console.log(userlist);

      for(var i=0 ; i<userlist.length; i++)
      {
        var username=userlist[i];
        refreshToken.refreshAccessToken(myUserRefreshToken,keys.codechef.username.toLowerCase()).then(function(accessToken){
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
            var rankings  =  result['result']['data']['content']['rankings'];
            var ratings   =  result['result']['data']['content']['ratings'];
            var institute =  result['result']['data']['content']['organization'];
            var band      = result['result']['data']['content']['band'];
            User.findOneAndUpdate({'codechefId':username},{$set:{rating:ratings,ranking:rankings,institute:institute,band:band}}, function(err, doc){
              console.log("Updated "+username);
            });;
          });
         });
      }
    });
  },1000*60*60*10);
}



const port = process.env.port || 8090;

app.listen(port, function(){
  console.log("App listening on port " + port);
})
