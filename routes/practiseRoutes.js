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
  res.render('practise',{
    user: req.user.codechefId
  });
});

router.post('/submissions', authCheck, function(req, res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){

        var options = {
          method: 'GET',
          uri: 'https://api.codechef.com/submissions/?limit=5&username=' + req.user.codechefId,
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
          },
          json: true
        };

        request(options)
        .then(function (result) {
          res.send(result['result']['data']['content']);
         })
        .catch(function (err) {
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
