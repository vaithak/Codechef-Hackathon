const request = require('request-promise');
const router = require('express').Router();
const refreshToken = require('../config/refreshToken');
const User = require('../models/userModel');
const recommend = require('../helpers/recommend');
const md5 = require('md5');

const authCheck = function(req,res, next){
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};

// Gets problem body from codechef
function requestProblemData(problemCode, accessToken){
  return new Promise(function(resolve, reject){
    var options = {
      method: 'GET',
      uri: 'https://api.codechef.com/contests/PRACTICE/problems/' + problemCode,
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken
      },
      json: true
    };

    request(options)
    .then(function (result) {
      resolve(result['result']['data']['content']['body']);
     })
    .catch(function (err) {
        console.log("Request error" + err);
        reject(err);
    });
  });
}


router.get('/', authCheck, function(req, res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
        recommend.reloadProblem(currentUser, accessToken).then(function(problem){
          requestProblemData(problem['problemCode'], accessToken).then(function(problemData){
            problem['data'] = problemData;
            res.render('practise',{
              user: req.user.codechefId,
              problem: problem
            });
          });
        });
      });
    }
    else
    {
      res.redirect('/error.html');
    }
  })
  .catch(function(err){
    res.redirect("/error.html");
  });
});

// To recommend a harder problem
router.post('/hard', authCheck, function(req, res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
        recommend.recommendDifferentProblem(currentUser, accessToken, "harder").then(function(problem){
          requestProblemData(problem['problemCode'], accessToken).then(function(problemData){
            problem['data'] = problemData;
            res.send(problem);
          });
        });
      })
      .catch(function (err) {
            console.log("Request error" + err);
            res.redirect('/error.html');
      });
    }
    else
    {
      console.log("Request error" + err);
      res.redirect('/error.html');
    }
  });
});

// To recommend an easier problem
router.post('/easy',authCheck,function(req,res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
        recommend.recommendDifferentProblem(currentUser, accessToken, "easier").then(function(problem){
          requestProblemData(problem['problemCode'], accessToken).then(function(problemData){
            problem['data'] = problemData;
            res.send(problem);
          });
        });
      })
      .catch(function (err) {
            console.log("Request error" + err);
            res.redirect('/error.html');
      });
    }
    else
    {
      console.log("Request error" + err);
      res.redirect('/error.html');
    }
  });
});

// To show last 5 submissions
router.post('/submissions', authCheck, function(req, res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
        // console.log(accessToken);
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
