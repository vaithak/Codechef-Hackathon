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
    res.render('notes', { user: req.user.codechefId });
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
router.post('/retreive', authCheck, function(req, res){
    User.findOne({codechefId: req.user.codechefId}).then(function(currentUser){
      res.send(currentUser.notes);
    });
});


module.exports = router;
