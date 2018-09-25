const router = require('express').Router();
const request = require('request-promise');
const User = require('../models/userModel');
const refreshToken = require('../config/refreshToken');
const bodyParser = require('body-parser');
const authCheck = function(req, res, next){
    if(!req.user){
        res.send("Login");
    } else {
        next();
    }
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', authCheck, function(req,res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    var followingData = [];
    var i=0;
    // console.log(currentUser)
    var arrayLength = currentUser['following'].length;
    // console.log(arrayLength);
    recursive();

    function recursive(){
      if(i < arrayLength)
      {
        var temp = {};
        User.findOne({codechefId: currentUser['following'][i]}).then(function(currentFollowing){
          if(currentFollowing)
          {
            temp['ranking']   = currentFollowing['ranking']['allContestRanking']['global'];
            temp['username']  = currentFollowing['codechefId'];
            temp['rating']    = currentFollowing['rating']['allContest'];
            temp['institute'] = currentFollowing['institute'];
            temp['band']      = currentFollowing['band'];
            followingData.push(temp);
          }
          i++;
          recursive();
        });
      }
      else {
        followingData.sort(function(x,y){
          if(x['ranking']!=0 && y['ranking']!=0)
            return x['ranking'] - y['ranking'];
          else if(x['ranking'] != 0)
            return -1;
          else if(y['ranking'] != 0)
            return 1;
          else
            return 0;
        });
        res.render('following',{
          user: req.user.codechefId,
          following: followingData
        });
      }
    }
  });
});

router.post('/remove', authCheck, function(req,res){
  var unFollow = req.body.unFollow;
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser && unFollow!=req.user.codechefId)
    {
      currentUser['following'].splice(currentUser['following'].indexOf(unFollow), 1);
      User.findOneAndUpdate({codechefId: req.user.codechefId}, {$set: {following: currentUser['following'] } }).then(function(){
        res.send("Done");
      });
    }
    else {
      res.send("Error");
    }
  });
});

router.post('/add', authCheck, function(req,res){
  var toFollow = req.body.follow;
  var confirmed = req.body.confirmed;
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      var data={};
      var msg="";
      if(currentUser['following'].includes(toFollow))
      {
        msg="You are already following this person";
        data['message']=msg;
        res.send(data);
      }
      else
      {
        User.findOne({codechefId: toFollow}).then(function(person){
          if(person)
          {
            if(confirmed == "true")
            {
              currentUser['following'].push(person['codechefId']);
              User.findOneAndUpdate({codechefId: currentUser['codechefId']}, {$set: {following: currentUser['following'] }}).then(function(){
                msg="Added";
                data['message']=msg;
                res.send(data);
              })
              .catch(function(err){
                console.log(err);
                res.redirect("/error.html");
              });
            }
            else
            {
              msg="Confirm";
              data['message']=msg;
              var content = {};
              content['ranking']   = person['ranking']['allContestRanking']['global'];
              content['username']  = person['codechefId'];
              content['rating']    = person['rating']['allContest'];
              content['institute'] = person['institute'];
              content['band']      = person['band'];

              data['content']=content;
              res.send(data);
            }
          }
          else
          {
              msg="Username not found in our database";
              data['message']=msg;
              res.send(data);
          }
        });
      }
    }
    else {
      res.redirect("/error.html");
    }
  });
});

module.exports = router;
