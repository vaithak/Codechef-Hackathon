const request = require('request-promise');
const router = require('express').Router();
const refreshToken = require('../config/refreshToken');
const User = require('../models/userModel');
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
      var accessToken = refreshToken.refreshAccessToken(currentUser['refreshToken']);

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
        res.render('profile', { user: result });
      });
      .catch(function (err) {
          throw err;
          console.log("Request error" + err);
          res.redirect('/error.html');
      });
    }
    else
    {
      res.redirect('/error.html');
    }
  });
});

module.exports = router;
