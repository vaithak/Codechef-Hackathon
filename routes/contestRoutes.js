const router = require('express').Router();
const request = require('request-promise');
const User = require('../models/userModel');
const MailList =require('../models/MailListModel');
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

router.get('/', authCheck, function(req, res){
    // console.log(req.user);
    User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
    if(currentUser)
    {
        refreshToken.refreshAccessToken(currentUser['refreshToken'] ,req.user.codechefId ,req ,res).then(function(accessToken){
        var options = {
          method: 'GET',
          uri: 'https://api.codechef.com/contests?status=present',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
          },
          json: true // Automatically parses the JSON string in the response
        };

        request(options)
        .then(function (result) {
          // console.log(result['result']['data']['content']['contestList']);
          var options = {
            method: 'GET',
            uri: 'https://api.codechef.com/contests?status=future',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
          },
            json: true // Automatically parses the JSON string in the response
          };

        request(options)
        .then(function (result2) {
          // console.log(result2['result']['data']['content']);
            res.render('contests', {
                user: req.user.codechefId,
                email: req.user.email,
                reminder: req.user.reminder,
                ongoing: result['result']['data']['content']['contestList'],
                upcoming: result2['result']['data']['content']['contestList']
             });
         })
        .catch(function (err) {
            throw err;
            console.log("Request error" + err);
            res.redirect('/error.html');
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

router.post('/email', authCheck, function(req, res){
    var email=req.body.email;
    User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'email': email}}, function(err, doc){
        console.log("Updated");
    });
    res.render('contests',{
        user: req.user.codechefId,
        email: req.user.email,
        reminder: req.user.reminder
    })
})
// Endpoint for saving the user's notes
router.post('/remind', authCheck, function(req, res){
    var change = !req.user.reminder;
    // console.log(User);
    if(req.user.email)
    {
        if(change)
        {
            var newEmail=new MailList({Id:req.user.email});
            newEmail.save(function(err,doc){
                console.log("saved");
            });
        }
        else
        {
            MailList.deleteOne({Id: req.user.email},function(err,doc){
                console.log("Removed");
            });
        }
        console.log("in routes");
        User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'reminder': change}}, function(err, doc){
          if (err)
            {console.log(err);
            return res.status(500).send({ error: err });}
          else
            return res.send("succesfully changed");
        });
    }
    else
    {
        res.render('email',{ user: req.user.codechefId});
    }


});


module.exports = router;
