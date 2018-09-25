const router = require('express').Router();
const User = require('../models/userModel');
const Articles = require('../models/articlesModel');
const refreshToken = require('../config/refreshToken');
const bodyParser = require('body-parser');
const md5 = require('md5');

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

// Route to edit an Article
router.get('/edit', authCheck, function(req,res){
  Articles.findOne({_id: req.query.id, author: req.user.codechefId}).then(function(idArticle){
    if(idArticle){
      res.render("editArticle",{
        user: req.user.codechefId,
        article: idArticle
      });
    }
    else{
        res.redirect('/articles/');
    }
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});


// Route to save edited Article
router.post('/edit', authCheck, function(req,res){
  // console.log(req.body.content)
  Articles.findOneAndUpdate({_id: req.body.id, author: req.user.codechefId},{$set: {title: req.body.title, content: req.body.content, tags: req.body.tags, visibility: req.body.visibility}}).then(function(idArticle){
      res.redirect('/articles/');
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});


// Route to show a particluar Article
router.get('/:id', function(req,res){
  Articles.findOne({_id: req.params.id}).then(function(idArticle){
    if(idArticle){
      if(idArticle['visibility']==="public"){
        var user=false;
        var followingBool=false;

        if(req.user)
        {
          user=req.user.codechefId;
          if(req.user.following.includes(idArticle['author']))
          {
            followingBool=true;
          }
        }

        User.findOne({codechefId: idArticle['author']}).then(function(authorUser){
            res.render('showIdArticle', {
              user: user,
              article: idArticle,
              gravatar: md5(authorUser['codechefId']),
              author: authorUser,
              followingBool:followingBool
            });
        });
      }
      else if(idArticle['visibility']==="following" && req.user){
        User.findOne({codechefId: idArticle['author']}).then(function(authorUser){
          if(authorUser['following'].includes(req.user.codechefId)){
            res.render('showIdArticle', {
              user: req.user.codechefId,
              article: idArticle,
              gravatar: md5(req.user.codechefId),
              author: authorUser,
              followingBool: true
            });
          }
          else{
            res.redirect('/articles/');
          }
        });
      }
      else{
          res.redirect('/articles/');
      }
    }
    else{
        res.redirect('/articles/');
    }
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});


// Like an article
router.post('/like', authCheck, function(req,res){
  Articles.findOne({_id: req.body.id}).then(function(currArticle){

  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});

// Dislike an article
router.post('/dislike', authCheck, function(req,res){
  Articles.findOneAndUpdate({_id: req.body.id, author: req.user.codechefId},{$set: {title: req.body.title, content: req.body.content, tags: req.body.tags, visibility: req.body.visibility}}).then(function(idArticle){
      res.redirect('/articles/');
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});






// Route to show articles of a given user
// router.get('/users/:username', function(req,res){
//   Articles.find({author: req.params.username}).then(function(idArticle){
//     res.render('showUserArticles',{
//       user: user
//     });
//   })
// });

module.exports = router;
