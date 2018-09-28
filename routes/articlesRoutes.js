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

// Showing featured Articles
router.get('/', function(req,res){
  Articles.find().then(function(articles){
    articles.sort(function(x,y){
      return (y['likes'] - y['dislikes']) -  ( x['likes'] - x['dislikes']);
    });
    if(req.user){
      res.render('featured',{
        articles: articles,
        user:req.user.codechefId
      });
    }
    else{
      res.render('featured',{
        articles: articles,
        user:false
      });
    }
  })
  .catch(function(err){
    res.redirect('/');
  });
});

// For writing a new article
router.get('/write', authCheck, function(req,res){
  res.render('writeArticles', {
    user: req.user.codechefId
  });
});

// Saving an article
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

// router.post('/firstsearch',authCheck,function(req,res){
//   Articles.find({},function(err,docs){
//       res.send(docs);
//   })
// })


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
      docs.sort(function(x,y){
        return (y['likes'] - y['dislikes']) -  ( x['likes'] - x['dislikes']);
      });
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
      var likedBool = false;
      var dislikedBool = false;
      var bookmarkedBool = false;

      if(req.user){
        User.findOne({codechefId: req.user.codechefId}).then(function(currUser){

          if(currUser['likedArticles'].includes(idArticle['_id'].toString())){
            likedBool = true;
          }
          if(currUser['dislikedArticles'].includes(idArticle['_id'].toString())){
            dislikedBool = true;
          }
          if(currUser['savedArticles'].includes(idArticle['_id'].toString())){
            bookmarkedBool = true;
          }
          if(currUser['following'].includes(idArticle['author'].toString()))
          {
            followingBool=true;
          }

          if(idArticle['visibility']==="public"){
            User.findOne({codechefId: idArticle['author']}).then(function(authorUser){
                res.render('showIdArticle', {
                  user: req.user.codechefId,
                  article: idArticle,
                  gravatar: md5(authorUser['codechefId']),
                  author: authorUser,
                  followingBool:followingBool,
                  likedBool: likedBool,
                  dislikedBool: dislikedBool,
                  bookmarkedBool: bookmarkedBool
                });
            });
          }
          else if(idArticle['visibility']==="following"){
            User.findOne({codechefId: idArticle['author']}).then(function(authorUser){
              if(authorUser['following'].includes(req.user.codechefId)){
                res.render('showIdArticle', {
                  user: req.user.codechefId,
                  article: idArticle,
                  gravatar: md5(req.user.codechefId),
                  author: authorUser,
                  followingBool: followingBool,
                  likedBool: likedBool,
                  dislikedBool: dislikedBool
                });
              }
              else{
                res.redirect('/articles/');
              }
            });
          }
          else if((idArticle['visibility']==="onlyMe") && (req.user.codechefId == idArticle['author']) ){
            res.render('showIdArticle', {
              user: req.user.codechefId,
              article: idArticle,
              gravatar: md5(req.user.codechefId),
              author: currUser,
              followingBool: true,
              likedBool: likedBool,
              dislikedBool: dislikedBool
            });
          }
        })
      }
      else if(idArticle['visibility']==="public"){
        User.findOne({codechefId: idArticle['author']}).then(function(authorUser){
            res.render('showIdArticle', {
              user: false,
              article: idArticle,
              gravatar: md5(authorUser['codechefId']),
              author: authorUser,
              followingBool:false,
              likedBool: false,
              dislikedBool: false,
              bookmarkedBool: false
            });
        });
      }
    }
    else{
        res.redirect('/articles/');
    }
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/articles');
  });
});


// Like an article
router.post('/like', authCheck, function(req,res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currUser){
    var id = req.body.id;
    var currDislikedArticles = currUser['dislikedArticles'];
    var currLikedArticles = currUser['likedArticles'];
    var message = "";

    Articles.findOne({_id: id}).then(function(idArticle){

      var currLikes    = idArticle['likes'];
      var currDislikes = idArticle['dislikes'];

      if(!idArticle){
          res.redirect('/articles/');
      }
      else{

        if(currLikedArticles.includes(id)){
          currLikedArticles.splice(currLikedArticles.indexOf(id), 1);
          message = "Removed";
          currLikes = currLikes - 1;
        }
        else{
          if(currDislikedArticles.includes(id)){
            currDislikedArticles.splice(currDislikedArticles.indexOf(id), 1);
            currDislikes = currDislikes - 1;
          }
          currLikedArticles.push(id);
          currLikes = currLikes + 1;
          message = "Added";
        }


        User.updateOne({codechefId: req.user.codechefId}, {$set: {dislikedArticles: currDislikedArticles, likedArticles: currLikedArticles} }).then(function(){
          Articles.updateOne({_id: id}, {$set: {likes: currLikes, dislikes: currDislikes} }).then(function(){
            res.send({
              message: message,
              dislikes: currDislikes,
              likes: currLikes
            });
          })
        })
        .catch(function(err){
          console.log(err);
          res.redirect('/error.html');
        });
      }

    })
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});


// Dislike an article
router.post('/dislike', authCheck, function(req,res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currUser){
    var id = req.body.id;
    var currDislikedArticles = currUser['dislikedArticles'];
    var currLikedArticles = currUser['likedArticles'];
    var message = "";

    Articles.findOne({_id: id}).then(function(idArticle){

      var currLikes    = idArticle['likes'];
      var currDislikes = idArticle['dislikes'];

      if(!idArticle){
          res.redirect('/articles/');
      }
      else{

        if(currDislikedArticles.includes(id)){
          currDislikedArticles.splice(currDislikedArticles.indexOf(id), 1);
          message = "Removed";
          currDislikes = currDislikes - 1;
        }
        else{
          if(currLikedArticles.includes(id)){
            currLikedArticles.splice(currLikedArticles.indexOf(id), 1);
            currLikes = currLikes - 1;
          }
          currDislikedArticles.push(id);
          currDislikes = currDislikes + 1;
          message = "Added";
        }


        User.updateOne({codechefId: req.user.codechefId}, {$set: {dislikedArticles: currDislikedArticles, likedArticles: currLikedArticles} }).then(function(){
          Articles.updateOne({_id: id}, {$set: {likes: currLikes, dislikes: currDislikes} }).then(function(){
            res.send({
              message: message,
              dislikes: currDislikes,
              likes: currLikes
            });
          })
        })
        .catch(function(err){
          console.log(err);
          res.redirect('/error.html');
        });
      }

    })
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});


// Bookmarking an article
router.post('/bookmark', authCheck, function(req,res){
  User.findOne({codechefId: req.user.codechefId}).then(function(currUser){
    var id = req.body.id;
    var currSavedArticles = currUser['savedArticles'];
    var message = "";

    Articles.findOne({_id: id}).then(function(idArticle){
      if(!idArticle)
        res.redirect('/articles/');
      else{
        if(currSavedArticles.includes(id)){
          currSavedArticles.splice(currSavedArticles.indexOf(id), 1);
          message = "Removed";
        }
        else{
          currSavedArticles.push(id);
          message = "Added";
        }

        User.updateOne({codechefId: req.user.codechefId}, {$set: {savedArticles: currSavedArticles} }).then(function(currUser){
            res.send({
              message: message
            });
        })
        .catch(function(err){
          console.log(err);
          res.redirect('/error.html');
        });
      }
    })
  })
  .catch(function(err){
    console.log(err);
    res.redirect('/error.html');
  });
});


// Route to show articles of a given user
router.get('/users/:username/:type', function(req,res){
  User.findOne({codechefId: req.params.username}).then(function(userAuthor){
    if((req.params.type === "posted")){
      Articles.find({author: req.params.username}).then(function(userArticles){
        if(req.user){
          res.render('showUserArticles',{
            userArticles: userArticles,
            user: req.user.codechefId,
            author: userAuthor,
            gravatar: md5(userAuthor['codechefId'])
          });
        }
        else{
          res.render('showUserArticles',{
            userArticles: userArticles,
            user: false,
            author: userAuthor,
            gravatar: md5(userAuthor['codechefId'])
          });
        }
      })
    }
    // to complete bookmarked and liked
    else if(req.params.type === "bookmarked"){
      User.findOne({codechefId: req.params.username}).then(function(currUser){
        var articles = currUser['savedArticles'];
        if(req.user){
          res.render('showUserArticles',{
            userArticles: currUser['savedArticles'],
            user: req.user.codechefId,
            author: userAuthor,
            gravatar: md5(userAuthor['codechefId'])
          });
        }
        else{
          res.render('showUserArticles',{
            userArticles: userArticles,
            user: false,
            author: userAuthor,
            gravatar: md5(userAuthor['codechefId'])
          });
        }
      })
    }
    else if(req.params.type === "liked"){

    }
    else{
      res.redirect('/articles/');
    }
  })
  .catch(function(err){
    res.redirect("/articles/");
  });
});

module.exports = router;
