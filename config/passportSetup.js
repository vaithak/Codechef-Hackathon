const keys = require('./keys');
const request = require('request-promise');
const User = require('../models/userModel');
const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

var strategy = new OAuth2Strategy({
   authorizationURL:  keys.codechef.authURL,
   tokenURL:          keys.codechef.tokenURL,
   clientID:          keys.codechef.clientID,
   clientSecret:      keys.codechef.clientSecret,
   callbackURL:       keys.codechef.callbackURL,
   state:             Math.random().toString(36).replace('0.', '')
  },
  function(accessToken, refreshToken, params,profile, done) {

    refreshToken = params['result']['data']['refresh_token'];
    accessToken = params['result']['data']['access_token'];

    var options = {
      method: 'GET',
      uri: 'https://api.codechef.com/users/me',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken
      },
      json: true // Automatically parses the JSON string in the response
    };

    request(options)
    .then(function (result) {
        var username = result['result']['data']['content']['username'];
        User.findOneAndUpdate({codechefId: username},{
          refreshToken: refreshToken,
          accessTokenTimeStamp: +(new Date().getTime()),
          accessToken: accessToken
        }).then(function(currentUser){
            if(currentUser)
            {
                done(null, currentUser);
            }
            else
            {
                new User({
                    codechefId: username,
                    refreshToken: refreshToken,
                    accessToken: accessToken,
                    accessTokenTimeStamp: +(new Date().getTime())
                }).save().then(function(newUser) {
                    done(null, newUser);
                });
            }
        });
    })
    .catch(function (err) {
        // API call failed...
        throw err;
        console.log("Request error" + err);
    });

  }
);
passport.use(strategy);