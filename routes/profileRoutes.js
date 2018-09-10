const request = require('request-promise');
const router = require('express').Router();
const refreshToken = require('../config/refreshToken');
const User = require('../models/userModel');
const md5 = require('md5');

const authCheck = function(req,res, next){
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};

router.get('/', authCheck, function(req, res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
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
          console.log(result['result']['data']['content']);
          res.render('profile', {
            result: result['result']['data']['content'],
            user: req.user.codechefId,
            gravatar: md5(req.user.codechefId)
           });
         })
        .catch(function (err) {
            throw err;
            console.log("Request error" + err);
            res.redirect('/error.html');
        });

      });
    }
    else
    {
      res.redirect('/error.html');
    }
  });
});

module.exports = router;
