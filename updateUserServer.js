const mongoose = require('mongoose');
const keys = require('./config/keys');
const User=require('./models/userModel');
const refreshToken = require('./config/refreshToken2');
const request = require('request-promise');
const CronJob = require('cron').CronJob;

mongoose.connect(keys.mongodb.dbURI,{ useNewUrlParser: true }, function() {
    console.log('connected to mongodb');
    job.start();
});

const job = new CronJob('30 10 */10 * * *', function() {
  var userlist=[];
  User.findOne({codechefId :keys.codechef.username.toLowerCase()}).then(function(currentUser){
    var myUserRefreshToken = currentUser['refreshToken'];

    User.find(function(err,docs){
      // console.log(docs);
      for(var i=0; i<docs.length; i++)
      {
        userlist.push(docs[i]["codechefId"]);
      }

      console.log(userlist);
      var i=0;
      recursive();

      function recursive()
      {
        var username=userlist[i];
        console.log(username);
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
            var band      =  result['result']['data']['content']['band'];
            var fullname  =  result['result']['data']['content']['fullname'];
            User.findOneAndUpdate({'codechefId':username},{$set:{fullname:fullname,rating:ratings,ranking:rankings,institute:institute,band:band}}, function(err, doc){
              console.log("Updated "+username);
              i++;
              setTimeout(function(){},1000*60*5);
              if(i<userlist.length)
                recursive();
            });;
          })
          .catch(function(err){
              console.log(err);
              console.log("Continuing");
          });
         });
      }
    });
  });

});
