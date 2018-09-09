const keys = require('./keys');
const request = require('request-promise');
const User = require('../models/userModel');

function refreshAccessToken(refreshToken, username)
{
  return new Promise(function(resolve, reject){

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
        var refreshToken = result['result']['data']['refresh_token'];
        User.findOneAndUpdate({codechefId: username},{refreshToken: refreshToken}).then(function(){
            resolve(result['result']['data']['access_token']);
        });
      })
      .catch(function (err) {
          throw err;
          reject(err);
      });
    });
}

module.exports.refreshAccessToken = refreshAccessToken;
