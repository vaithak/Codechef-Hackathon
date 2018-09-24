const router = require('express').Router();
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

router.get('/', authCheck, function(req,res){
  res.render('articles', {
    user: req.user.codechefId
  });
});

router.get('/write', authCheck, function(req,res){
  res.render('writeArticles', {
    user: req.user.codechefId
  });
});

module.exports = router;
