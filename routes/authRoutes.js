const router = require('express').Router();
const passport = require('passport');

// auth logout
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/codechef',passport.authenticate('oauth2', {}), function (req, res) {
  console.log("Received request");
});

router.get('/callback',
  passport.authenticate('oauth2', { failureRedirect: '/auth/codechef' }),
  function(req, res) {
    if (!req.user) {
      console.log("hi");
      throw new Error('user null');
    }
    res.redirect('/profile/');
  }
);

module.exports = router;
