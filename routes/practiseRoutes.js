const request = require('request-promise');
const router = require('express').Router();
const refreshToken = require('../config/refreshToken');
const User = require('../models/userModel');
const recommend = require('../helpers/recommend').recommendProblem;
const recommend2 = require('../helpers/recommend').recommend;
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
        if(Object.keys(currentUser['lastRecommended']).length != 0)
        {//may remove
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
              var problem = currentUser['lastRecommended'];
              requestProblemData(problem['problemCode'], accessToken).then(function(result){
                  problem['data'] = result;
                  // console.log\(problem\);
                  res.render('practise',{
                    user: req.user.codechefId,
                    problem: problem
                  });
              })
              .catch(function(err){
                  console.log(err);
                  res.redirect('/error.html');
              });
            }
            else
            {
              //re recommend
              recommend(req.user.codechefId, accessToken).then(function(problem){
                User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
                  if (err)
                  {
                    console.log(err);
                    return res.status(500).send({ error: err });
                  }
                  else
                  {
                    requestProblemData(problem['problemCode'], accessToken).then(function(result){
                        problem['data'] = result;
                        // console.log\(problem\);
                        res.render('practise',{
                          user: req.user.codechefId,
                          problem: problem
                        });
                    })
                    .catch(function(err){
                        console.log(err);
                        res.redirect('/error.html');
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
        { //first recommend
          recommend(req.user.codechefId, accessToken).then(function(problem){
            User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
              if (err)
              {
                console.log(err);
                return res.status(500).send({ error: err });
              }
              else
              {
                requestProblemData(problem['problemCode'], accessToken).then(function(result){
                    problem['data'] = result;
                    // console.log\(problem\);
                    res.render('practise',{
                      user: req.user.codechefId,
                      problem: problem
                    });
                })
                .catch(function(err){
                    console.log(err);
                    res.redirect('/error.html');
                });
              }
            });
          })
          .catch(function (err) {
              console.log("Request error" + err);
              res.redirect('/error.html');
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

router.post('/hard', authCheck, function(req, res){
  // var difficulty=req.body.difficulty;
  var type=true;
  recommendType(req,res,type)
});

router.post('/easy',authCheck,function(req,res){
  var type=false;
  recommendType(req,res,type);
})

function recommendType(req,res,isHard){
  // console.log(isHard);
    User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      // console.log(currentUser['questionLevel']);
      //check for submit
      refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){

        // recommend(req.user.codechefId, accessToken).then(function(problem){
          recommend2(currentUser,isHard).then(function(problem){
          User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'lastRecommended': problem}}, function(err,doc) {
            if (err)
            {
              console.log(err);
              return res.status(500).send({ error: err });
            }
            else
            {
              requestProblemData(problem['problemCode'], accessToken).then(function(result){
                  problem['data'] = result;
                  res.send(problem);
              })
              .catch(function(err){
                  console.log(err);
                  res.redirect('/error.html');
              });
            }
          });
        }).
        catch(function(err){
          console.log("Request error" + err);
          res.redirect('/error.html');
        });

      });
    }
    else
    {
      console.log("Request error" + err);
      res.redirect('/error.html');
    }
  });
}
function requestProblemData(problemCode, accessToken)
{
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

module.exports = router;
