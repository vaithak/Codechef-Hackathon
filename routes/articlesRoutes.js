const router = require('express').Router();
const User = require('../models/userModel');
const Articles = require('../models/articlesModel');
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
  res.render('articles', {
    user: req.user.codechefId
  });
});

router.get('/write', authCheck, function(req,res){
  res.render('writeArticles', {
    user: req.user.codechefId
  });
});

router.post('/save', authCheck, function(req,res){
  new Articles({
      title:      req.body.title,
      author:     req.user.codechefId,
      visibility: req.body.visibility,
      tags:       req.body.tags,
      content:    req.body.bodyContent
  }).save().then(function(newArticle) {
      res.send("Done");
  });
});

router.post('/firstsearch',authCheck,function(req,res){
  Articles.find({},function(err,docs){
      res.send(docs); 
  })
})


router.post('/search',authCheck,function(req,res){
  var searchquery=req.body.searchquery;
  var type=req.body.type;
  var data={};
  if(type === "your")
  {
    Articles.find({author:req.user.codechefId,tags:{$all:searchquery}},function(err,docs){
      data=docs;
      res.send(data);
    });
  }
  else if(type==="saved")
  {
    //currently don't work
    // res.send(req.user.articles);
  }
  else if(type==="featured")
  {
    Articles.find({tags:{$all:searchquery}},function(err,docs){
      res.send(docs);
    })
  }
  else{
    res.redirect("/error.html");
  }

});

// router.get('/:id', function(req,res){
//
// });

module.exports = router;
