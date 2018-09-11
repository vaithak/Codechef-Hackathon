const request = require('request-promise');
const router = require('express').Router();
const refreshToken = require('../config/refreshToken');
const User = require('../models/userModel');
const recommend = require('../helpers/recommend').recommendProblem;
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
        if(currentUser['lastRecommended'])
        {
          var options = {
            method: 'GET',
            uri: 'https://api.codechef.com/submissions/?result=AC&username=' + req.user.codechefId + '&problemCode=' + currentUser['lastRecommended'],
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            json: true
          };

          request(options)
          .then(function (result) {
            if(!result['result']['data']['content'])
            {
              res.render('practise',{
                user: req.user.codechefId,
                problem: currentUser['lastRecommended']
              });
            }
            else
            {
              recommend(req.user.codechefId, accessToken).then(function(problem){
                User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
                  if (err)
                  {
                    console.log(err);
                    return res.status(500).send({ error: err });
                  }
                  else
                  {
                    res.render('practise',{
                      user: req.user.codechefId,
                      problem: problem
                    });
                  }
                });
              });
            }
           })
          .catch(function (err) {
              console.log("Request error" + err);
              res.redirect('/error.html');
          });
        }
        else
        {
          recommend(req.user.codechefId, accessToken).then(function(problem){
            User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
              if (err)
              {
                console.log(err);
                return res.status(500).send({ error: err });
              }
              else
              {
                res.render('practise',{
                  user: req.user.codechefId,
                  problem: problem
                });
              }
            });
          });
        }

      });
    }
    else
    {
      res.redirect('/error.html');
    }
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

router.post('/recommend', authCheck, function(req, res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
        if(!currentUser['lastRecommended'])
        {
          var options = {
            method: 'GET',
            uri: 'https://api.codechef.com/submissions/?result=AC&username=' + req.user.codechefId + '&problemCode=' + currentUser['lastRecommended']['problemCode'],
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            json: true
          };

          request(options)
          .then(function (result) {
            if(result['result']['data']['content'])
            {
              res.send(currentUser['lastRecommended']);
            }
            else
            {
              recommend(req.user.codechefId, accessToken).then(function(problem){
                User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
                  if (err)
                  {
                    console.log(err);
                    return res.status(500).send({ error: err });
                  }
                  else
                  {
                    res.send(problem);
                  }
                });
              });
            }
           })
          .catch(function (err) {
              console.log("Request error" + err);
              res.redirect('/error.html');
          });
        }
        else
        {
          recommend(req.user.codechefId, accessToken).then(function(problem){
            User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
              if (err)
              {
                console.log(err);
                return res.status(500).send({ error: err });
              }
              else
              {
                res.send(problem);
              }
            });
          });
        }

      });
    }
    else
    {
      res.redirect('/error.html');
    }
  });
});

module.exports = router;
