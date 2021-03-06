
const keys = require('./keys');
const request = require('request-promise');
const User = require('../models/userModel');

function refreshAccessToken(refreshToken, username)
{
  return new Promise(function(resolve, reject){

    User.findOne({codechefId: username}).then(function(currentUser){
      var currTime = +(new Date().getTime());
      var diff = currTime - currentUser['accessTokenTimeStamp'];

      // Refreshing only if time exceeds 45 minutes
      if(diff < 1000*60*45)
      {
        resolve(currentUser['accessToken']);
      }
      else
      {
        var data = {
          'grant_type'    : 'refresh_token',
          'client_id'     :  keys.codechef.clientID,
          'client_secret' :  keys.codechef.clientSecret,
          'refresh_token' :  refreshToken,
        };

        var options = {
          method: 'POST',
          uri: keys.codechef.tokenURL,
          headers: {
              'content-Type': 'application/json',
          },
          body: data,
          json: true // Automatically parses the JSON string in the response
        };

        request(options)
        .then(function (result) {
          var newRefreshToken = result['result']['data']['refresh_token'];
          User.update({codechefId: username},{$set: {refreshToken: newRefreshToken, accessToken: result['result']['data']['access_token'], accessTokenTimeStamp: currTime}}).then(function(){
              resolve(result['result']['data']['access_token']);
          });
        })
        .catch(function (err) {
          reject(err);

        });
      }

    })
    .catch(function(err){
      reject(err);
    });

    });
}

module.exports.refreshAccessToken = refreshAccessToken;
