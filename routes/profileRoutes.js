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

        var optionSubmissions = {
          method: 'GET',
          uri: 'https://api.codechef.com/submissions/?result=AC&limit=20&username=' + req.user.codechefId,
          headers: {
              'Authorization': 'Bearer ' + accessToken
          },
          json: true
        };

        request(options)
        .then(function (result) {

          request(optionSubmissions)
            .then(function(resultSubmission) {
              // console.log(resultSubmission['result']['data']['content']);
              res.render('profile', {
                result: result['result']['data']['content'],
                resultSubmission: resultSubmission['result']['data']['content'],
                user: req.user.codechefId,
                level:req.user.practiseLevel,
                gravatar: md5(req.user.codechefId)
               });

            })
            .catch(function(err){
              console.log("Request error" + err);
              res.redirect('/error.html');
            });
         })
        .catch(function (err) {
            console.log("Request error" + err);
            res.redirect('/error.html');
        });

      });
    }
    else
    {
      res.redirect('/');
    }
  });
});

module.exports = router;
