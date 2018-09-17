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
    if(currentUser)
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

module.exports = router;
