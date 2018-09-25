const router = require('express').Router();
const User = require('../models/userModel');
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
    res.render('notes', {
      user: req.user.codechefId ,
      userToShow: req.user.codechefId
    });
});

// Any user's notes
router.get('/:username', function(req, res){
    if(req.user){
      res.render('notes', {
        userToShow: req.params.username ,
        user: req.user.codechefId
      });
    }
    else{
      res.render('notes', {
        userToShow: req.params.username,
        user: false
       });
    }
});



// Endpoint for saving the user's notes
router.post('/save', authCheck, function(req, res){
    var notes = req.body.allNotes;
    User.findOneAndUpdate({'codechefId': req.user.codechefId}, {$set: {'notes': notes}}, function(err, doc){
      if (err)
        {console.log(err);
        return res.status(500).send({ error: err });}
      else
        return res.send("succesfully saved");
    });

});

// Endpoint for Retreiving notes of a user
router.post('/retreive', function(req, res){
    User.findOne({codechefId: req.body.username}).then(function(currentUser){
      if(currentUser){
      var userAsking = "public";
      if(req.user){
        if(req.user.codechefId === req.body.username){
          userAsking="onlyMe";
        }
        else if(currentUser['following'].includes(req.body.username)){
          userAsking="following";
        }
      }

      if(userAsking == "onlyMe"){
        res.send(currentUser['notes']);
      }
      else{
        var notesToSend = [];
        for(var i=0; i<currentUser['notes'].length; i++ ){
          if(currentUser['notes'][i]['visibility']){
            if(currentUser['notes'][i]['visibility'] === userAsking || currentUser['notes'][i]['visibility'] === "public"){
              notesToSend.push(currentUser['notes'][i]);
            }
          }
        }
        res.send(notesToSend);
      }
    }
    else{
      res.redirect('/');
    }
    });
});


module.exports = router;
