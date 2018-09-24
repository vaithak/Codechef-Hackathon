const router = require('express').Router();
const request = require('request-promise');
const User = require('../models/userModel');
const refreshToken = require('../config/refreshToken');
const bodyParser = require('body-parser');
const authCheck = function(req, res, next){
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', authCheck, function(req,res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    var friendsData = [];
    var i=0;
    // console.log(currentUser)
    var arrayLength = currentUser['friends'].length;
    // console.log(arrayLength);
    recursive();

    function recursive(){
      if(i < arrayLength)
      {
        var temp = {};
        User.findOne({codechefId: currentUser['friends'][i]}).then(function(currentFriend){
          if(currentFriend)
          {
            temp['ranking']   = currentFriend['ranking']['allContestRanking']['global'];
            temp['username']  = currentFriend['codechefId'];
            temp['rating']    = currentFriend['rating']['allContest'];
            temp['institute'] = currentFriend['institute'];
            temp['band']      = currentFriend['band'];
            friendsData.push(temp);
          }
          i++;
          recursive();
        });
      }
      else {
        friendsData.sort(function(x,y){
          if(x['ranking']!=0 && y['ranking']!=0)
            return x['ranking'] - y['ranking'];
          else if(x['ranking'] != 0)
            return -1;
          else if(y['ranking'] != 0)
            return 1;
          else
            return 0;
        });
        res.render('friends',{
          user: req.user.codechefId,
          friends: friendsData
        });
      }
    }
  });
});

router.post('/remove', authCheck, function(req,res){
  var friendToRemove = req.body.friend;
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser && friendToRemove!=req.user.codechefId)
    {
      // console.log(currentUser['friends']);
      currentUser['friends'].splice(currentUser['friends'].indexOf(friendToRemove), 1);
      User.findOneAndUpdate({codechefId: req.user.codechefId}, {$set: {friends: currentUser['friends'] } }).then(function(){
        res.send("Done");
      });
    }
    else {
      res.send("Error");
    }
  });
});

router.post('/add', authCheck, function(req,res){
  var friendToAdd = req.body.friend;
  var confirmed = req.body.confirmed;
  User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
      // console.log(currentUser['friends']);
      var data={};
      var msg="";
      if(currentUser['friends'].includes(friendToAdd))
      {
        msg="This Person is already your friend";
        data['message']=msg;
        res.send(data);
      }
      else
      {
        User.findOne({codechefId: friendToAdd}).then(function(person){
          if(person)
          {
            if(confirmed == "true")
            {
              currentUser['friends'].push(person['codechefId']);
              User.findOneAndUpdate({codechefId: currentUser['codechefId']}, {$set: {friends: currentUser['friends'] }}).then(function(){
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
